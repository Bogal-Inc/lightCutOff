import {TranslateService} from '@ngx-translate/core';
import {MarkerDetailsComponent} from '../components/marker-details/marker-details.component';
import {Position, Report, ReportSatus, ServiceType, reportServiceType} from '@Models/report.model';
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
import {MapFilter, ReportSort} from '../components/map-menu/components/map-filter/map-filter.component';
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
  private impactCircles: L.LayerGroup;
  private markerCurrentPosition: L.Marker;
  private readonly icons = {
    user: MapViewComponent.pinIcon(Const.markerColor.user),
    electricity: MapViewComponent.pinIcon(Const.markerColor.electricity),
    water: MapViewComponent.pinIcon(Const.markerColor.water),
    recovred: MapViewComponent.pinIcon(Const.markerColor.recovred)
  };
  readonly projectTitle = Const.app.title;
  isErrorMapActive = false;
  isMapReady = false;
  reports: Report[];
  /** Signalements après filtre/tri — alimentent la carte et les cercles. */
  filteredReports: Report[];
  /** Sous-ensemble visible dans le cadre actuel de la carte — alimente la liste. */
  visibleReports: Report[];
  private currentFilter: MapFilter = { service: null, statuses: [], sort: 'recent' };
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

  mapFiltered(filter: MapFilter) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  /** Mêmes règles que l'app : service (Tout/Élec/Eau) ET statut (aucun coché = tous), puis tri. */
  private applyFilter() {
    const filter = this.currentFilter;
    const results = (this.reports || []).filter((report: Report) => {
      if (filter.service && reportServiceType(report) !== filter.service) {
        return false;
      }
      if (filter.statuses.length > 0 && !filter.statuses.includes(report.status)) {
        return false;
      }
      return true;
    });

    this.filteredReports = this.sortReports(results, filter.sort);
    this.addClusters(this.filteredReports);
    this.updateVisibleReports();
  }

  /** Liste synchronisée avec la carte : seules les coupures du cadre visible apparaissent. */
  private updateVisibleReports() {
    if (!this.map || !this.filteredReports) {
      return;
    }
    const bounds = this.map.getBounds();
    this.visibleReports = this.filteredReports.filter(
      report => bounds.contains([+report.position.lat, +report.position.lng])
    );
  }

  /** Tri de l'app : Récentes (date), Actives (en cours d'abord), Confirmées (nb de confirmations). */
  private sortReports(reports: Report[], sort: ReportSort): Report[] {
    const byDate = (a: Report, b: Report) =>
      (b.reportedAt?.toMillis?.() || 0) - (a.reportedAt?.toMillis?.() || 0);

    const sorted = [...reports];
    if (sort === 'active') {
      sorted.sort((a, b) => {
        const activeDelta = Number(b.status === ReportSatus.ONGOING) - Number(a.status === ReportSatus.ONGOING);
        return activeDelta !== 0 ? activeDelta : byDate(a, b);
      });
    } else if (sort === 'confirmed') {
      sorted.sort((a, b) =>
        ((b.confirmationCount || 0) - (a.confirmationCount || 0)) || byDate(a, b));
    } else {
      sorted.sort(byDate);
    }
    return sorted;
  }

  private initMap(position: Position){
    this.isLoader = false;
    this.isMapReady = true;

    const cameroonBounds: L.LatLngBoundsExpression = [
      [Const.coordsCameroon.south, Const.coordsCameroon.west],
      [Const.coordsCameroon.north, Const.coordsCameroon.east]
    ];

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [position.lat, position.lng],
      zoom: ZOOM,
      doubleClickZoom: false
    });

    this.addTiles();

    // la liste n'affiche que les coupures dans le cadre actuel de la carte
    this.map.on('moveend zoomend', () => this.updateVisibleReports());

    // le conteneur vient d'être affiché : recalcule la taille réelle puis
    // ouvre la vue sur le Cameroun entier (navigation ensuite libre)
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.fitBounds(cameroonBounds);
    });

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
              if (report.status === ReportSatus.RESOLVED) {
                const resolvedAt = report.resolvedAt.toDate();
                const tomorrow = new Date(resolvedAt.getTime() + 86400000);
                if (tomorrow > now) {
                  return report;
                }
              }
              return report;
            });
          this.applyFilter();
        },
      err => log.error('report not load', err));
  }

  private addClusters(reports: Report[]) {
    if (this.markersClusters) {
      this.markersClusters.remove();
    }
    if (this.impactCircles) {
      this.impactCircles.remove();
    }
    this.markersClusters = L.markerClusterGroup();
    this.impactCircles = L.layerGroup();
    reports.forEach(report => {
      this.markersClusters.addLayer(this.markerFactory(report));
      // « tache » d'impact des coupures en cours (comme dans l'app) :
      // rayon posé par la CF onConfirmationCreated, plancher 150 m à l'affichage
      if (report.status === ReportSatus.ONGOING) {
        this.impactCircles.addLayer(this.impactCircle(report));
      }
    });
    this.map.addLayer(this.impactCircles);
    this.map.addLayer(this.markersClusters);
  }

  private impactCircle(report: Report): L.Circle {
    const color = (reportServiceType(report) === ServiceType.WATER) ? '#0EA5E9' : '#F88E01';
    const radius = Math.max(report.impactRadiusM || 0, 150);

    return L.circle([+report.position.lat, +report.position.lng], {
      radius,
      color,
      weight: 1,
      opacity: 0.45,
      fillColor: color,
      fillOpacity: 0.15,
      interactive: false
    });
  }

  /**
   * @description create the marker with its read-only detail popup
   * @param report: all report
   */
  private markerFactory(report: Report): L.Marker {
    const marker = L.marker([+report.position.lat, +report.position.lng], {
      icon: (report.status === ReportSatus.RESOLVED)
        ? this.icons.recovred
        : this.icons[reportServiceType(report)]
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
            const reportedAt = (report.resolvedAt) ? `Terminer le: ${report.resolvedAt.toDate()}` : '';
            const description = `
            Signalement du: ${report.reportedAt.toDate()} \n
            ${reportedAt} \n
            Ville: ${report.location.city} \n
            Quartier: ${report.location.neighborhood}
            `;

            this.metaService.setFacebookTags(
              `${environment.domain}/map`,
              this.translateService.instant('main.map-view.fb_title', {cretedAt: report.reportedAt.toDate()}),
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
