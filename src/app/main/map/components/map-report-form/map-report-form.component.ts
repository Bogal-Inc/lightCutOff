import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Subscription, of } from 'rxjs';
import { first, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { GeoArea, Position, Report, ReportSatus, ServiceType, reportServiceType } from '@Models/report.model';
import { ReportService } from '../../../../core/services-firebase';
import { NominatimService, NominatimResult } from '@Services/nominatim.service';
import { IpLocationService } from '@Services/ip-location.service';
import { Logger } from '@Services/logger.service';
import { distanceMeters } from '@Helpers/geo.helper';

const log = new Logger('map-report-form.component');

/** Rayon anti-doublon — AppConstants.duplicateRadiusMeters de l'app. */
const DUPLICATE_RADIUS_M = 500;
/** Écart décrit/GPS au-delà duquel on demande un accord explicite (app : 2 km). */
const DESCRIBED_MISMATCH_M = 2000;
/** Longueur max de la description — AppConstants.maxDescriptionLength. */
const MAX_DESCRIPTION_LENGTH = 500;
/** Garde-fou local anti-spam entre deux envois depuis ce navigateur (site). */
const COOLDOWN_MS = 10 * 60 * 1000;
const COOLDOWN_STORAGE_KEY = 'njukaLastReportAt';
/** Position dérivée de l'IP (pas de GPS/WiFi) : un VPN la déplace où il veut. */
const MAX_ACCURACY_M = 10000;
/** IP et GPS à plus de 500 km l'un de l'autre = position apparente faussée. */
const MAX_IP_GPS_DISTANCE_M = 500000;

/** Lieu résolu (GPS ou décrit) : position + zone lisible. */
interface LocatedPlace {
  position: Position;
  area: GeoArea;
}

/** Écran superposé au formulaire (équivalent des dialogues de l'app). */
type Overlay = null | 'duplicate' | 'locationUnavailable' | 'mismatch'
  | 'cooldown' | 'vpnSuspected' | 'lowAccuracy' | 'error';

/**
 * Formulaire de signalement — MIROIR du formulaire de l'app
 * (lib/screens/report_form_screen.dart) : date/heure de constatation,
 * service segmenté, position GPS affichée + « Décrire ma position » (la
 * description PRIME sur le GPS, accord explicite si écart > 2 km),
 * description, promesse de retour, attestation obligatoire, anti-doublon
 * (confirmer / signaler quand même / voir mon signalement).
 * Gardes propres au site : cooldown local + cohérence IP/GPS anti-VPN.
 */
@Component({
  standalone: false,
  selector: 'app-map-report-form',
  templateUrl: './map-report-form.component.html',
  styleUrls: ['./map-report-form.component.scss']
})
export class MapReportFormComponent implements OnInit, OnDestroy {
  /** Signalements publics déjà chargés par la carte (base de l'anti-doublon). */
  @Input() reports: Report[] = [];

  readonly serviceTypes = ServiceType;
  readonly maxDescriptionLength = MAX_DESCRIPTION_LENGTH;
  readonly todayIso = new Date().toISOString().slice(0, 10);
  reportForm: FormGroup;
  overlay: Overlay = null;
  sending = false;
  locating = true;
  /** Position GPS courante (affichage ; l'envoi re-résout, comme l'app). */
  current: LocatedPlace | null = null;
  /** Position DÉCRITE par l'utilisateur — remplace le GPS quand posée. */
  described: LocatedPlace | null = null;
  describedQuery = '';
  /** Panneau « Décrire ma position » ouvert (équivalent du dialogue app). */
  describeOpen = false;
  describeSuggestions: NominatimResult[] = [];
  describeNotFound = false;
  /** Candidat doublon + indicateur « c'est le mien ». */
  duplicate: Report | null = null;
  duplicateIsOwn = false;
  duplicateZone = '';
  /** Lieu décrit en attente de l'accord explicite (écart > 2 km du GPS). */
  pendingMismatch: { place: LocatedPlace; query: string; km: string } | null = null;
  cooldownMinutesLeft = 0;
  private uid: string | null = null;
  private describeSub?: Subscription;

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
      description: [''],
      observedDate: [''],
      observedTime: [''],
      attested: [false],
      describeQuery: ['']
    });

    const lastReportAt = this.lastReportAt();
    if (lastReportAt && Date.now() - lastReportAt < COOLDOWN_MS) {
      this.cooldownMinutesLeft = Math.ceil((COOLDOWN_MS - (Date.now() - lastReportAt)) / 60000);
      this.overlay = 'cooldown';
    }
  }

  ngOnInit(): void {
    this.angularFireAuth.authState.pipe(first(u => !!u))
      .subscribe(user => this.uid = user.uid);

    // comme l'app : la position est chargée à l'ouverture, pour affichage
    this.loadCurrentPosition();

    // suggestions du panneau « Décrire ma position » (autocomplete, biais GPS)
    this.describeSub = this.reportForm.get('describeQuery').valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(value => {
        this.describeNotFound = false;
        const query = (value || '').trim();
        return query.length >= 3
          ? this.nominatimService.suggest(query, this.gpsViewbox())
              .pipe(catchError(() => of([])))
          : of([]);
      })
    ).subscribe(results => this.describeSuggestions = results);
  }

  ngOnDestroy(): void {
    this.describeSub?.unsubscribe();
  }

  get selectedService(): ServiceType {
    return this.reportForm.value.serviceType;
  }

  get attested(): boolean {
    return !!this.reportForm.value.attested;
  }

  get hasObserved(): boolean {
    return !!(this.reportForm.value.observedDate || this.reportForm.value.observedTime);
  }

  /** Libellé de la ligne position : décrit > GPS > états (comme l'app). */
  get positionLabel(): string | null {
    if (this.described) {
      const label = this.areaLabel(this.described.area);
      return label || this.describedQuery;
    }
    if (this.locating || !this.current) {
      return null; // le template affiche l'état locating/unavailable
    }
    return this.areaLabel(this.current.area);
  }

  setService(serviceType: ServiceType) {
    this.reportForm.patchValue({ serviceType });
  }

  clearObserved() {
    this.reportForm.patchValue({ observedDate: '', observedTime: '' });
  }

  // ----- position décrite (dialogue « Décrire ma position » de l'app) -----

  openDescribe() {
    this.describeOpen = true;
    this.describeNotFound = false;
    this.reportForm.patchValue({ describeQuery: this.describedQuery || '' });
  }

  closeDescribe() {
    this.describeOpen = false;
    this.describeSuggestions = [];
  }

  clearDescribed() {
    this.described = null;
    this.describedQuery = '';
  }

  async pickDescribeSuggestion(suggestion: NominatimResult) {
    const place: LocatedPlace = {
      position: { lat: +suggestion.lat, lng: +suggestion.lon },
      area: await this.reverseArea(+suggestion.lat, +suggestion.lon)
    };
    this.applyDescribed(place, suggestion.display_name);
  }

  /** « Localiser » : géocode la saisie brute (repli quand aucune suggestion choisie). */
  async locateDescription() {
    const query = (this.reportForm.value.describeQuery || '').trim();
    if (!query) {
      return;
    }
    const results = await this.nominatimService.search(query, this.gpsViewbox())
      .toPromise().catch(() => []);
    if (!results || results.length === 0) {
      this.describeNotFound = true;
      return;
    }
    const place: LocatedPlace = {
      position: { lat: +results[0].lat, lng: +results[0].lon },
      area: await this.reverseArea(+results[0].lat, +results[0].lon)
    };
    this.applyDescribed(place, query);
  }

  /** La description prime sur le GPS — mais jamais à l'insu de l'utilisateur. */
  private applyDescribed(place: LocatedPlace, query: string) {
    this.closeDescribe();
    if (this.current) {
      const meters = distanceMeters(this.current.position, place.position);
      if (meters > DESCRIBED_MISMATCH_M) {
        this.pendingMismatch = {
          place,
          query,
          km: (meters / 1000).toFixed(meters >= 10000 ? 0 : 1)
        };
        this.overlay = 'mismatch';
        return;
      }
    }
    this.described = place;
    this.describedQuery = query;
  }

  confirmMismatch() {
    this.described = this.pendingMismatch.place;
    this.describedQuery = this.pendingMismatch.query;
    this.pendingMismatch = null;
    this.overlay = null;
  }

  cancelMismatch() {
    this.pendingMismatch = null;
    this.overlay = null;
  }

  // ----- soumission (même déroulé que _submit de l'app) -----

  async onSubmit() {
    if (!this.attested || this.sending) {
      return;
    }

    // position décrite : elle prime, pas de GPS requis (comme l'app)
    if (this.described) {
      await this.checkDuplicateThenCreate(this.described, 'described');
      return;
    }

    this.sending = true;
    let located: { position: Position; accuracy: number };
    try {
      located = await this.locate();
    } catch (err) {
      log.error('geolocation refused or unavailable', err);
      this.sending = false;
      this.overlay = 'locationUnavailable';
      return;
    }

    // gardes propres au site : précision (position IP) + cohérence IP/GPS (VPN)
    if (located.accuracy > MAX_ACCURACY_M) {
      this.sending = false;
      this.overlay = 'lowAccuracy';
      return;
    }
    const area = await this.reverseArea(located.position.lat, located.position.lng);
    const ipLocation = await this.ipLocationService.locate().toPromise();
    if (ipLocation) {
      const countryMismatch = area.countryCode && ipLocation.countryCode !== area.countryCode;
      const farFromIp = distanceMeters(located.position, ipLocation) > MAX_IP_GPS_DISTANCE_M;
      if (countryMismatch || farFromIp) {
        log.error(`ip/gps mismatch: ip=${ipLocation.countryCode} gps=${area.countryCode}`);
        this.sending = false;
        this.overlay = 'vpnSuspected';
        return;
      }
    }

    this.sending = false;
    await this.checkDuplicateThenCreate({ position: located.position, area }, 'gps');
  }

  /** Depuis l'écran « Position indisponible » : ouvrir le panneau décrire. */
  fallbackDescribe() {
    this.overlay = null;
    this.openDescribe();
  }

  /** Depuis l'écran « Position indisponible » : retenter la localisation. */
  async fallbackRetryGps() {
    this.overlay = null;
    this.locating = true;
    this.current = null;
    await this.loadCurrentPosition();
  }

  private async checkDuplicateThenCreate(place: LocatedPlace, source: 'gps' | 'described') {
    const nearest = this.findNearbyOngoing(place.position);
    if (nearest) {
      this.duplicate = nearest;
      this.duplicateIsOwn = !!this.uid && nearest.userId === this.uid;
      this.duplicateZone = this.areaLabel(nearest.location) || '';
      this.pendingCreate = { place, source };
      this.overlay = 'duplicate';
      return;
    }
    await this.create(place, source);
  }

  private pendingCreate: { place: LocatedPlace; source: 'gps' | 'described' } | null = null;

  async onConfirmDuplicate() {
    if (!this.duplicate || !this.pendingCreate) {
      return;
    }
    this.overlay = null;
    this.sending = true;
    try {
      await this.reportService.confirmReport(this.duplicate.id, this.pendingCreate.place.position);
      this.rememberReportAt();
      this.analytics.logEvent('report_confirm', { source: 'website' });
      this.activeModal.close({ type: 'confirmed', report: this.duplicate });
    } catch (err) {
      log.error('confirmation refused', err);
      this.sending = false;
      this.overlay = 'error';
    }
  }

  async onCreateAnyway() {
    if (!this.pendingCreate) {
      return;
    }
    this.overlay = null;
    await this.create(this.pendingCreate.place, this.pendingCreate.source);
  }

  /** « Voir mon signalement » : ferme et recentre la carte dessus. */
  onViewMine() {
    this.activeModal.close({ type: 'viewMine', report: this.duplicate });
  }

  closeOverlay() {
    this.overlay = null;
  }

  private async create(place: LocatedPlace, source: 'gps' | 'described') {
    this.sending = true;
    try {
      const description = (this.reportForm.value.description || '').trim();
      await this.reportService.createReport({
        serviceType: this.selectedService,
        description: description || null,
        position: place.position,
        location: place.area,
        positionSource: source,
        reportedAt: this.observedAt()
      });
      this.rememberReportAt();
      this.analytics.logEvent('report_create', { source: 'website', service: this.selectedService });
      this.activeModal.close({ type: 'created', position: place.position });
    } catch (err) {
      log.error('report creation failed', err);
      this.sending = false;
      this.overlay = 'error';
    }
  }

  // ----- helpers -----

  private async loadCurrentPosition() {
    try {
      const located = await this.locate();
      this.current = {
        position: located.position,
        area: await this.reverseArea(located.position.lat, located.position.lng)
      };
    } catch {
      this.current = null;
    }
    this.locating = false;
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

  private reverseArea(lat: number, lng: number): Promise<GeoArea> {
    return this.nominatimService.reverse(lat, lng).toPromise()
      .catch(() => ({ country: '', countryCode: '', region: '', city: '', neighborhood: '' }));
  }

  /** « quartier, ville » comme le label GeoArea de l'app. */
  private areaLabel(area: GeoArea | undefined): string {
    if (!area) {
      return '';
    }
    return [area.neighborhood, area.city].filter(part => !!part).join(', ')
      || area.region || area.country || '';
  }

  private gpsViewbox(): string | undefined {
    if (!this.current) {
      return undefined;
    }
    const { lat, lng } = this.current.position;
    const d = 0.5; // ≈ 50 km de biais autour de la position
    return [lng - d, lat + d, lng + d, lat - d].join(',');
  }

  /** Date/heure de constatation → Date (jamais dans le futur), ou null = maintenant. */
  private observedAt(): Date | null {
    const { observedDate, observedTime } = this.reportForm.value;
    if (!observedDate && !observedTime) {
      return null;
    }
    const now = new Date();
    const date = observedDate ? new Date(observedDate) : now;
    const [hours, minutes] = (observedTime || `${now.getHours()}:${now.getMinutes()}`)
      .split(':').map((v: string) => +v);
    const dt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return dt > now ? now : dt;
  }

  private findNearbyOngoing(position: Position): Report | null {
    const candidates = (this.reports || []).filter(report =>
      report.status === ReportSatus.ONGOING
      && reportServiceType(report) === this.selectedService
      && report.position
      && distanceMeters(position, { lat: +report.position.lat, lng: +report.position.lng }) <= DUPLICATE_RADIUS_M
    );
    if (candidates.length === 0) {
      return null;
    }
    return candidates.reduce((nearest, report) =>
      distanceMeters(position, { lat: +report.position.lat, lng: +report.position.lng })
        < distanceMeters(position, { lat: +nearest.position.lat, lng: +nearest.position.lng })
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
