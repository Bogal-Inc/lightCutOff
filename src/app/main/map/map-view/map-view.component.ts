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
import {GoogleMapsLoaderService} from '@Services/google-maps-loader.service';
import {ToastrService} from 'ngx-toastr';
import {Const} from 'src/environments/const';
import {MapLegendComponent} from '../components/map-legend/map-legend.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ComponentService} from '@Services/component.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {MapFilterComponent} from '../components/map-menu/components/map-filter/map-filter.component';
import {MapMenuComponent} from '../components/map-menu/map-menu.component';
import {MapModel} from '@Models/map.model';
import { MapService } from '@Services/map.service';
import {ActivatedRoute} from '@angular/router';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {environment} from '../../../../environments/environment';
import {GeolocationComponent} from '../../../modals/geolocation/geolocation.component';

const log = new Logger('map-view.component');

/**
 * Carte publique en LECTURE SEULE : affiche les signalements (coupure / rétabli),
 * la recherche de lieu et les filtres. La création/clôture de signalements se fait
 * exclusivement dans l'application mobile Njuka.
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
  private gmap: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild(MapFilterComponent, {read: ElementRef})
  public mapFilter: ElementRef;
  @ViewChild(MapMenuComponent, {read: ElementRef})
  public MapMenuComponent: ElementRef;
  @ViewChild('infosReport', { read: ViewContainerRef })
  private infosReport: ViewContainerRef;
  private map: google.maps.Map;
  private mapM: MapModel;
  readonly projectTitle = Const.app.title;
  isErrorMapActive = false;
  markerCurrentPosition: google.maps.Marker;
  isMapReady = false;
  reports: Report[];
  isLoader = true;
  unsubsscribe$ = new Subject<void>();
  reportsMarkers: any;
  markersClusters;
  activeInfoWindow: any;

  constructor(
    private mapsApiLoader: GoogleMapsLoaderService,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private componentService: ComponentService,
    private mapService: MapService,
    private analytics: AngularFireAnalytics,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

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
        new MetaTag(METATAG.KEYWORDS, 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, délestages, coupures, carte interactive, map, marker, marqueur'),
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('main.map-view.desc_page'))
      ]);
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnDestroy(): void {
    this.unsubsscribe$.next();
    this.unsubsscribe$.complete();
  }

  mapInitializer() {
    this.mapsApiLoader.load().then(
      () => {
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
      },
      () => {
        log.error('Map not load');
        this.isErrorMapActive = true;
        this.isLoader = false;
    });
  }

  /**
   * @description search place, locality to find position exactly
   * @param event key word
   */
  onSearchPlace(event: { query: any; }) {
    log.debug('map search');
    this.analytics.logEvent('map_search');

    const service = new google.maps.places.PlacesService(this.map);
    const request = {
      query: event.query,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        log.debug(results[0].geometry.location, 'place found');
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(14);
      }else {
        log.error(event.query, 'not found');
        this.toastrService.error(this.translateService.instant('main.map-view.no_place'));
      }
    });
  }

  goToMarker(report: Report) {
    this.map.setCenter(report.position);
    this.map.setZoom(14);
    const marker = this.markerFactory(report);
    google.maps.event.trigger(marker, 'click');
  }

  mapFiltered(reportStatus: ReportSatus[]) {
    this.mapClear();
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

  private mapClear() {
    this.markersClusters.setMap(null);
    this.reportsMarkers.forEach(marker => marker.setMap(null));
  }

  private initMap(position: Position){
    this.isLoader = false;
    this.isMapReady = true;

    this.mapM = new MapModel(
      position,
      this.gmap.nativeElement,
      [
        this.legends?.nativeElement,
        this.mapFilter?.nativeElement
      ]
    );
    this.map = this.mapM.map;

    this.initMarkerUser(this.mapM.markerUserOption(this.translateService.instant('main.map-view.your_position')));
    this.LoadReports();
  }

  private initMarkerUser(markerOption: google.maps.MarkerOptions) {
    log.debug('init current marker');
    if (this.markerCurrentPosition) {
      this.markerCurrentPosition.setMap(null);
      this.markerCurrentPosition = null;
    }

    // marqueur informatif de la position de l'utilisateur (non déplaçable, lecture seule)
    this.markerCurrentPosition = new google.maps.Marker({
      ...markerOption,
      draggable: false
    });
    this.markerCurrentPosition.setMap(this.map);
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

  private addClusters(reports) {
    this.reportsMarkers = reports.map(report => {
      return this.markerFactory(report);
    });
    this.markersClusters = this.mapM.addMarkersToCluster(this.reportsMarkers);
  }

  /**
   * @description create the marker, add in map and add read-only detail infowindow
   * @param report: all report
   */
  private markerFactory(report: Report): google.maps.Marker {
    log.debug('Marker factory', report);

    const currentMareker = new google.maps.Marker({
        position: new google.maps.LatLng(+report.position.lat, +report.position.lng),
        icon: {
          url: (report.recovredAt === null) ? Const.markerColor.cut : Const.markerColor.recovred
        },
        map: this.map
    });

    const content = this.componentService.createComponent({report}, MarkerDetailsComponent, this.infosReport);
    this.addInfoWindow(currentMareker, content);

    return currentMareker;
  }

  private addInfoWindow(marker: google.maps.Marker, content = null, event= 'click'): google.maps.InfoWindow {
    log.debug('init infowindow on marker');

    const infoWindow = new google.maps.InfoWindow({
      content
    });
    const markerMap = marker.getMap();

    if (event === 'click') {
      google.maps.event.addListener(marker, event, () => {
        if (this.activeInfoWindow) {
          this.activeInfoWindow.close();
        }

        infoWindow.open(markerMap, marker);
        this.activeInfoWindow = infoWindow;
      });

    } else if (event === 'hover') {
      google.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(markerMap, marker));
      google.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());
    }

    return infoWindow;
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
