import {TranslateService} from '@ngx-translate/core';
import {MarkerDetailsComponent} from '../components/marker-details/marker-details.component';
import {Position, Report, ReportSatus} from '@Models/report.model';
import {ReportService} from '../../../core/services-firebase';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {ToastrService} from 'ngx-toastr';
import {Const} from 'src/environments/const';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ComponentService} from '@Services/component.service';
import {NominatimService} from '@Services/nominatim.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {ActivatedRoute} from '@angular/router';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {environment} from '../../../../environments/environment';
import {GeolocationComponent} from '../../../modals/geolocation/geolocation.component';

const log = new Logger('map-view.component');

const ZOOM = 13;
const ZOOM_MARKER = 14;

/**
 * Carte publique en LECTURE SEULE (Leaflet + tuiles Stadia Maps, repli OpenStreetMap —
 * même stack cartographique que l'application mobile Njuka). Affiche les signalements
 * (coupure / rétabli), la recherche de lieu (Nominatim) et les filtres.
 * La création/clôture de signalements se fait exclusivement dans l'application.
 */
@Component({
  standalone: false,
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', {static: false})
  private mapContainer: ElementRef;
  @ViewChild('infosReport', { read: ViewContainerRef })
  private infosReport: ViewContainerRef;
  private map: L.Map;
  private markersClusters: L.MarkerClusterGroup;
  private markerCurrentPosition: L.Marker;
  private readonly icons = {
    user: MapViewComponent.pinIcon(Const.markerColor.user),
    cut: MapViewComponent.pinIcon(Const.markerColor.cut),
    recovred: MapViewComponent.pinIcon(Const.markerColor.recovred)
  };
  readonly projectTitle = Const.app.title;
  isErrorMapActive = false;
  isMapReady = false;
  reports: Report[];
  isLoader = true;
  unsubsscribe$ = new Subject<void>();

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private componentService: ComponentService,
    private nominatimService: NominatimService,
    private analytics: AngularFireAnalytics,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  private static pinIcon(url: string): L.Icon {
    return L.icon({
      iconUrl: url,
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -40]
    });
  }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: `${environment.domain}/map`,
      page_path: '/map',
      page_title: 'Map'
    });

    navigator.permissions.query({
      name: 'geolocation'
    }).then((result) => {
      if (result.state === 'prompt') {
        this.modalService.open(GeolocationComponent);
      }
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('main.map-view.title_page'),
      [
        new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('main.map-view.desc_page'))
      ]);
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnDestroy(): void {
    this.unsubsscribe$.next();
    this.unsubsscribe$.complete();
    this.map?.remove();
  }

  mapInitializer() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
        log.debug('position user founded');

        this.initMap({
          lng: +position.coords.longitude,
          lat: +position.coords.latitude
        });

        // if param in url map
        this.goToMarkerWithUrl();
      },
      (err) => {
        log.error('geolocalization no actived or no application not connected', err);
        this.initMap(Const.coordsDefault);
      });
    } else {
      log.error('Your browser does not support Geolocation');
      this.toastrService.info(this.translateService.instant('main.map-view.error_geolocalize_no_browser'));
      this.initMap(Const.coordsDefault);
    }
  }

  /**
   * @description search place, locality to find position exactly (Nominatim)
   * @param event key word
   */
  onSearchPlace(event: { query: any; }) {
    log.debug('map search');
    this.analytics.logEvent('map_search');

    this.nominatimService.search(event.query).subscribe(
      results => {
        if (results.length > 0) {
          log.debug(results[0], 'place found');
          this.map.setView([+results[0].lat, +results[0].lon], ZOOM_MARKER);
        } else {
          log.error(event.query, 'not found');
          this.toastrService.error(this.translateService.instant('main.map-view.no_place'));
        }
      },
      () => this.toastrService.error(this.translateService.instant('main.map-view.no_place'))
    );
  }

  goToMarker(report: Report) {
    this.map.setView([+report.position.lat, +report.position.lng], ZOOM_MARKER);
    const marker = this.markerFactory(report);
    marker.addTo(this.map).openPopup();
  }

  mapFiltered(reportStatus: ReportSatus[]) {
    const reportsResults = (reportStatus.length > 0) ? this.getReportsByStatus(reportStatus) : this.reports;
    this.addClusters(reportsResults);
  }

  private getReportsByStatus(reportsStatus: ReportSatus[]) {
    let reportsResults = [];
    reportsStatus.forEach(
      ev => {
        const reportsFilter = this.reports.filter(
          (report: Report) => {
            if (ev === ReportSatus.CUT || ev === ReportSatus.CUT_OWNER) {
              return report.status === ReportSatus.CUT;
            }
            return report.status === ev;
          });
        reportsResults = reportsResults.concat(reportsFilter);
      });
    return reportsResults;
  }

  private initMap(position: Position){
    this.isLoader = false;
    this.isMapReady = true;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [position.lat, position.lng],
      zoom: ZOOM,
      maxBounds: [
        [Const.coordsCameroon.south, Const.coordsCameroon.west],
        [Const.coordsCameroon.north, Const.coordsCameroon.east]
      ],
      doubleClickZoom: false
    });

    this.addTiles();

    // le conteneur vient d'être affiché : recalcule la taille réelle de la carte
    setTimeout(() => this.map.invalidateSize());

    // marqueur informatif de la position de l'utilisateur (lecture seule)
    this.markerCurrentPosition = L.marker([position.lat, position.lng], {
      icon: this.icons.user,
      title: this.translateService.instant('main.map-view.your_position'),
      zIndexOffset: 2000
    }).addTo(this.map);

    this.LoadReports();
  }

  /**
   * Tuiles Stadia Maps si une clé est fournie, sinon repli OpenStreetMap
   * (même logique que l'app mobile).
   */
  private addTiles() {
    const stadiaKey = environment.stadiaApiKey;
    const osm = {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };
    const stadia = {
      url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        + ' &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
        + ' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };
    const tiles = (stadiaKey) ? stadia : osm;

    const layer = L.tileLayer(tiles.url, {
      attribution: tiles.attribution,
      maxZoom: 19
    }).addTo(this.map);

    if (stadiaKey) {
      // repli OSM si les tuiles Stadia ne chargent pas (clé invalide, quota...)
      let fellBack = false;
      layer.on('tileerror', () => {
        if (fellBack) { return; }
        fellBack = true;
        log.error('Stadia tiles failed, falling back to OpenStreetMap');
        layer.remove();
        L.tileLayer(osm.url, { attribution: osm.attribution, maxZoom: 19 }).addTo(this.map);
      });
    }
  }

  private LoadReports() {
    log.debug('load reports');

    const now = new Date();

    this.reportService.getReports({
      isDeleted: false,
      reportStatus: null,
      datestart: new Date(2020, 1, 1)
    })
      .pipe(
        takeUntil(this.unsubsscribe$)
      )
      .subscribe(
        (reports) => {
          // the reports closed from 24h is not visible on map
          this.reports = reports.filter(
            report => {
              if (report.location.city) {
                return report;
              }
              if (report.status === ReportSatus.CUT_COMPLETED) {
                const recovredAt = report.recovredAt.toDate();
                const tomorrow = new Date(recovredAt.getTime() + 86400000);
                if (tomorrow > now) {
                  return report;
                }
              }
              return report;
            });
          this.addClusters(this.reports);
        },
      err => log.error('report not load', err));
  }

  private addClusters(reports: Report[]) {
    if (this.markersClusters) {
      this.markersClusters.remove();
    }
    this.markersClusters = L.markerClusterGroup();
    reports.forEach(report => this.markersClusters.addLayer(this.markerFactory(report)));
    this.map.addLayer(this.markersClusters);
  }

  /**
   * @description create the marker with its read-only detail popup
   * @param report: all report
   */
  private markerFactory(report: Report): L.Marker {
    const marker = L.marker([+report.position.lat, +report.position.lng], {
      icon: (report.recovredAt === null) ? this.icons.cut : this.icons.recovred
    });

    marker.bindPopup(() =>
      this.componentService.createComponent({report}, MarkerDetailsComponent, this.infosReport)
    );

    return marker;
  }

  private goToMarkerWithUrl() {
    this.activatedRoute.queryParams.subscribe(params => {
      const reportId = params.reportId;

      if (reportId === undefined) {
        log.error('no report found');
        return;
      }

      if (reportId) {
        this.reportService.getReport(reportId).subscribe(
          report => {
            const reportedAt = (report.recovredAt) ? `Terminer le: ${report.recovredAt.toDate()}` : '';
            const description = `
            Signalement du: ${report._createdAt.toDate()} \n
            ${reportedAt} \n
            Ville: ${report.location.city} \n
            Quartier: ${report.location.neighborhood}
            `;

            this.metaService.setFacebookTags(
              `${environment.domain}/map`,
              this.translateService.instant('main.map-view.fb_title', {cretedAt: report._createdAt.toDate()}),
              description,
              `${environment.domain}/assets/static/images/logo.png`
            );

            this.goToMarker(report);
          },
          error => {
            log.error(error);
          }
        );
      }
    });
  }
}
