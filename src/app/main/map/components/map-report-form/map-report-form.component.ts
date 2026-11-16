import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { first } from 'rxjs/operators';
import { GeoArea, Position, Report, ReportSatus, ServiceType, reportServiceType } from '@Models/report.model';
import { ReportService } from '../../../../core/services-firebase';
import { NominatimService } from '@Services/nominatim.service';
import { IpLocationService } from '@Services/ip-location.service';
import { Logger } from '@Services/logger.service';
import { distanceMeters } from '@Helpers/geo.helper';

const log = new Logger('map-report-form.component');

/** Rayon anti-doublon : même périmètre que les vagues de notifications (app). */
const DUPLICATE_RADIUS_M = 500;
/** Garde-fou local anti-spam entre deux envois depuis ce navigateur. */
const COOLDOWN_MS = 10 * 60 * 1000;
const COOLDOWN_STORAGE_KEY = 'njukaLastReportAt';
/**
 * Position trop imprécise = dérivée de l'IP (pas de GPS/WiFi) : un VPN la
 * déplace n'importe où. Les vraies positions GPS/WiFi sont < 2 km de rayon.
 */
const MAX_ACCURACY_M = 10000;
/** IP et GPS à plus de 500 km l'un de l'autre = position apparente faussée. */
const MAX_IP_GPS_DISTANCE_M = 500000;

type FormState = 'form' | 'locating' | 'duplicate' | 'ownNearby' | 'sending'
  | 'geolocDenied' | 'lowAccuracy' | 'vpnSuspected' | 'cooldown' | 'error';

/**
 * Signalement d'une coupure depuis le site (lot 3) : géolocalisation
 * OBLIGATOIRE, anti-doublon par confirmation (< 500 m, même service),
 * document créé au schéma exact de l'app.
 */
@Component({
  standalone: false,
  selector: 'app-map-report-form',
  templateUrl: './map-report-form.component.html',
  styleUrls: ['./map-report-form.component.scss']
})
export class MapReportFormComponent {
  /** Signalements publics déjà chargés par la carte (base de l'anti-doublon). */
  @Input() reports: Report[] = [];

  readonly serviceTypes = ServiceType;
  reportForm: FormGroup;
  state: FormState = 'form';
  /** Candidat « coupure déjà signalée près de vous » (anti-doublon). */
  duplicate: Report | null = null;
  cooldownMinutesLeft = 0;
  private position: Position | null = null;
  /** GeoArea du reverse-géocodage, résolue pendant les contrôles et réutilisée à la création. */
  private location: GeoArea | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private nominatimService: NominatimService,
    private ipLocationService: IpLocationService,
    private angularFireAuth: AngularFireAuth,
    private analytics: AngularFireAnalytics
  ) {
    this.reportForm = this.formBuilder.group({
      serviceType: [ServiceType.ELECTRICITY],
      description: ['']
    });

    const lastReportAt = this.lastReportAt();
    if (lastReportAt && Date.now() - lastReportAt < COOLDOWN_MS) {
      this.cooldownMinutesLeft = Math.ceil((COOLDOWN_MS - (Date.now() - lastReportAt)) / 60000);
      this.state = 'cooldown';
    }
  }

  setService(serviceType: ServiceType) {
    this.reportForm.patchValue({ serviceType });
  }

  get selectedService(): ServiceType {
    return this.reportForm.value.serviceType;
  }

  /**
   * Soumission : géolocalise, contrôle la position (précision + cohérence
   * IP/GPS anti-VPN), cherche un doublon, puis crée ou propose de confirmer.
   */
  async onSubmit() {
    this.state = 'locating';
    let accuracy: number;
    try {
      ({ position: this.position, accuracy } = await this.locate());
    } catch (err) {
      log.error('geolocation refused or unavailable', err);
      this.state = 'geolocDenied';
      return;
    }

    // position dérivée de l'IP (pas de GPS/WiFi) : un VPN la déplace où il veut
    if (accuracy > MAX_ACCURACY_M) {
      log.error(`position accuracy too low (${Math.round(accuracy)} m)`);
      this.state = 'lowAccuracy';
      return;
    }

    // reverse-géocodage tout de suite : donne le pays GPS (contrôle VPN) et
    // sera réutilisé tel quel à la création
    this.location = await this.nominatimService
      .reverse(this.position.lat, this.position.lng).toPromise()
      .catch(() => ({ country: '', countryCode: '', region: '', city: '', neighborhood: '' }));

    // cohérence IP / GPS : pays différents ou > 500 km d'écart = VPN/proxy.
    // Service IP en panne → null → contrôle passé (fail-open).
    const ipLocation = await this.ipLocationService.locate().toPromise();
    if (ipLocation) {
      const countryMismatch = this.location.countryCode
        && ipLocation.countryCode !== this.location.countryCode;
      const farFromIp = distanceMeters(this.position, ipLocation) > MAX_IP_GPS_DISTANCE_M;
      if (countryMismatch || farFromIp) {
        log.error(`ip/gps mismatch: ip=${ipLocation.countryCode} gps=${this.location.countryCode}`);
        this.state = 'vpnSuspected';
        return;
      }
    }

    const nearest = await this.findNearbyOngoing();
    if (nearest) {
      const user = await this.angularFireAuth.authState.pipe(first(u => !!u)).toPromise();
      if (nearest.userId === user.uid) {
        this.state = 'ownNearby';
        return;
      }
      this.duplicate = nearest;
      this.state = 'duplicate';
      return;
    }

    await this.create();
  }

  /** « Confirmer » sur le candidat anti-doublon : +1 atomique + vote. */
  async onConfirmDuplicate() {
    if (!this.duplicate || !this.position) {
      return;
    }
    this.state = 'sending';
    try {
      await this.reportService.confirmReport(this.duplicate.id, this.position);
      this.rememberReportAt();
      this.analytics.logEvent('report_confirm', { source: 'website' });
      this.activeModal.close({ type: 'confirmed', report: this.duplicate });
    } catch (err) {
      // cas le plus courant : vote déjà déposé pour ce report (règles castsVote)
      log.error('confirmation refused', err);
      this.state = 'error';
    }
  }

  /** « C'est une autre coupure » : création malgré un report proche. */
  async onCreateAnyway() {
    await this.create();
  }

  private async create() {
    this.state = 'sending';
    try {
      const description = (this.reportForm.value.description || '').trim();
      await this.reportService.createReport({
        serviceType: this.selectedService,
        description: description || null,
        position: this.position,
        location: this.location
      });
      this.rememberReportAt();
      this.analytics.logEvent('report_create', { source: 'website', service: this.selectedService });
      this.activeModal.close({ type: 'created', position: this.position });
    } catch (err) {
      log.error('report creation failed', err);
      this.state = 'error';
    }
  }

  private locate(): Promise<{ position: Position; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('geolocation unsupported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          position: { lat: +pos.coords.latitude, lng: +pos.coords.longitude },
          accuracy: +pos.coords.accuracy
        }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    });
  }

  /** Plus proche coupure EN COURS du même service à moins de 500 m, s'il y en a une. */
  private async findNearbyOngoing(): Promise<Report | null> {
    const candidates = (this.reports || []).filter(report =>
      report.status === ReportSatus.ONGOING
      && reportServiceType(report) === this.selectedService
      && report.position
      && distanceMeters(this.position, { lat: +report.position.lat, lng: +report.position.lng }) <= DUPLICATE_RADIUS_M
    );
    if (candidates.length === 0) {
      return null;
    }
    return candidates.reduce((nearest, report) =>
      distanceMeters(this.position, { lat: +report.position.lat, lng: +report.position.lng })
        < distanceMeters(this.position, { lat: +nearest.position.lat, lng: +nearest.position.lng })
        ? report : nearest
    );
  }

  private lastReportAt(): number | null {
    try {
      const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      return raw ? +raw : null;
    } catch {
      return null;
    }
  }

  private rememberReportAt() {
    try {
      localStorage.setItem(COOLDOWN_STORAGE_KEY, `${Date.now()}`);
    } catch {
      // stockage indisponible (navigation privée) : le garde-fou saute, tant pis
    }
  }
}
