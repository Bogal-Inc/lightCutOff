import {TranslateService} from '@ngx-translate/core';
import {MarkerDetailsComponent} from '../components/marker-details/marker-details.component';
import {AuthService} from '@Services/auth.service';
import {Position, Report} from '@Models/report.model';
import {LoadingComponent} from '../../../shared/loading/loading.component';
import {ReportService} from '@Services/report.service';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {ToastrService} from 'ngx-toastr';
import {Const} from 'src/environments/const';
import {MapLegendComponent} from 'src/app/shared/map-legend/map-legend.component';
import {NgbModal, NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {Logger} from '@Services/logger.service';
import {MarkerCreateReportComponent} from '../components/marker-create-report/marker-create-report.component';
import {MarkerRecovredReportComponent} from '../components/marker-recovred-report/marker-recovred-report.component';
import {MetaService} from '@Services/meta.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MapService} from '@Services/map.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {TutoModalComponent} from '../components/tuto-modal/tuto-modal.component';
import {MapFilterComponent} from '../components/map-filter/map-filter.component';

const log = new Logger('map-view.component');

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./map-view.component.scss'],
  providers: [NgbTooltipConfig],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(MarkerCreateReportComponent, {read: ElementRef})
  private createReportFormElt: ElementRef;
  @ViewChild(LoadingComponent, {read: ElementRef})
  private loadingElt: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild(MapFilterComponent, {read: ElementRef})
  private mapFilter: ElementRef;
  @ViewChild('btnAddReport', {static: false})
  private btnAddReport: ElementRef;
  @ViewChild('recovredFormReport', { read: ViewContainerRef })
  private recovredFormReport: ViewContainerRef;
  @ViewChild('infosReport', { read: ViewContainerRef })
  private infosReport: ViewContainerRef;
  @ViewChild('tleft') public tooltip: NgbTooltip;
  private map: google.maps.Map;
  private markerCurrentInfoWindow: google.maps.InfoWindow;
  readonly projectTitle = Const.app.title;
  isErrorMapActive = false;
  markerCurrentPosition: google.maps.Marker;
  isFormLightCutOf = false;
  reports: Report[];
  formLoader: boolean;
  isLoader = true;
  unsubsscribe$ = new Subject<void>();
  reportsMarkers: any;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private mapService: MapService,
    private analytics: AngularFireAnalytics,
    private modalService: NgbModal,
    config: NgbTooltipConfig
  ) {
    config.placement = 'left';
    config.closeDelay = 3000;
   }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('map_page');

    this.metaService.initMetaMapView('main.map-view.title_page');
  }

  ngAfterViewInit() {
    this.mapInitializer();
    this.openTutoModal();
  }

  ngOnDestroy(): void {
    this.unsubsscribe$.next();
    this.unsubsscribe$.complete();
  }

  openTutoModal() {
    log.debug('open tutorial modal');

    const tutoPassed = localStorage.getItem('tutoPassed');
    if (tutoPassed !== null) {
      return;
    }

    this.modalService.open(TutoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  mapInitializer() {
    this.mapsApiLoader.load().then(
      () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( position => {
            log.debug('position user found');

            this.initMap({
              lng: +position.coords.longitude,
              lat: +position.coords.latitude
            });
          },
          () => {
            log.error('geolocalization no actived or no application not connected');
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
        }
      );
  }

  onCreateReport(event: any) {
    log.debug('create report');
    this.analytics.logEvent('create_report');

    const geocoder = new google.maps.Geocoder();
    const errorMessage = this.translateService.instant('main.map-view.error_no_cameroon');
    let googleLocation = null;

    geocoder.geocode(
      {location: this.mapService.position},
      (googleLocations, status) => {
      if (status === 'OK') {
        googleLocation = googleLocations[1];

        if (googleLocation) {
          const locality = this.mapService.getLocality(googleLocation);
          const country = locality[1];

          if (country === 'Cameroun' || country === 'Cameroon') {
            this.createReport(
              event,
              this.mapService.getAddresses(googleLocations, locality)
            );
          } else {
            log.error('current user no found in Camoeroon', googleLocation);
            this.toastrService.error(errorMessage, 'Error');
          }
        } else {
          log.error('No result found', googleLocation);
          this.toastrService.error(errorMessage, 'Error');
        }
      }
    });
  }

  /**
   * Search place in map
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
        log.error('your place not found');
        this.toastrService.error(this.translateService.instant('main.map-view.no_place'));
      }
    });
  }

  openInfoWindowCreateReport() {
    this.analytics.logEvent('plus_button_add_report');

    google.maps.event.trigger(this.markerCurrentPosition, 'click');
  }

  private initTooltip() {
    this.tooltip.open();
    setTimeout(() => {
      log.debug('tooltip close after 3 seconds');
      this.tooltip.close();
    }, 5000);
  }

  private createReport(query, location) {
    this.isLoader = true;
    this.formLoader = true;

    const report = {
      location,
      position: this.mapService.position,
      reportedAt: new Date(query),
    } as Report;

    this.markerCurrentInfoWindow.setContent(this.loadingElt.nativeElement);
    this.reportService.addReport(report).then(
      resp => {
        log.debug('report create');
        this.formLoader = false;
        report.id = resp.path.valueOf().split('/')[1];

        this.reportService.updateReport(report).then(
          () => {
            const data = {
              report,
              markerCurrentInfoWindow: this.markerCurrentInfoWindow
            };
            const recovredFromElement = this.mapService.createComponent(
              data,
              MarkerRecovredReportComponent,
              this.recovredFormReport
            );

            this.markerCurrentInfoWindow.setContent(recovredFromElement);
            this.markerCurrentPosition.setDraggable(false);
            this.markerCurrentPosition.setOpacity(0);
            this.toastrService.success(this.translateService.instant('main.map-view.signalement_add'));
          },
          err => {
            log.error('report not update', err);
            this.formLoader = false;
          }
        );
      },
      err => log.error('report not create', err)
    );
  }

  private initMap(position: Position){
    this.isLoader = false;
    this.isFormLightCutOf = true;
    this.mapService.position = position;
    this.map = this.mapService.initMap(
      this.gmap.nativeElement,
      this.legends.nativeElement,
      this.btnAddReport.nativeElement,
      this.mapFilter.nativeElement
    );
    this.mapService.map = this.map;
    this.initMarkerUser(this.mapService.markerUserOption());
    this.LoadReports();
    this.addEventsUserMarker();
    this.initTooltip();
  }

  private initMarkerUser(markerOption: google.maps.MarkerOptions) {
    log.debug('init current marker');
    if (this.markerCurrentPosition) {
      this.markerCurrentPosition.setMap(null);
      this.markerCurrentPosition = null;
    }

    this.markerCurrentPosition = new google.maps.Marker(markerOption);
    this.markerCurrentPosition.setMap(this.map);

    if (this.authService.getUser()){
      log.debug('add to current marker reported form in infos window');
      this.markerCurrentInfoWindow = this.addInfoWindow(this.markerCurrentPosition, this.createReportFormElt.nativeElement);
    } else {
      log.debug('current user are not identifier');
      const content = this.translateService.instant('main.map-view.error_no_user');
      this.markerCurrentInfoWindow = this.addInfoWindow(this.markerCurrentPosition, content);
    }
  }

  private LoadReports() {
    log.debug('load reports');

    const now = new Date();

    this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear())
    })
      .pipe(takeUntil(this.unsubsscribe$))
      .subscribe(reports => {
        this.reportsMarkers = reports.map(report => {
          return this.markerFactory(report);
        });
        this.mapService.addMarkersToCluster(this.reportsMarkers);
      },
      err => log.error('report not load', err)
      );
  }

  private markerFactory(report: Report): google.maps.Marker {
    log.debug('Marker factory', report);

    let content = null;
    const currentMareker = new google.maps.Marker({
        position: new google.maps.LatLng(+report.position.lat, +report.position.lng),
        icon: {
          url: (report.recovredAt === null) ?
            (this.authService.getUser().id === report._createdBy.id) ?
              Const.markerColor.cutUser :
              Const.markerColor.cut :
            Const.markerColor.recovred
        },
        map: this.map
    });

    if (report.recovredAt) {
      content = this.mapService.createComponent(report, MarkerDetailsComponent, this.infosReport);
      this.addInfoWindow(currentMareker, content);
    } else {
      if (this.authService.getUser().id === report._createdBy.id){
        const info = this.addInfoWindow(currentMareker, content);
        const data = {
          report,
          markerCurrentInfoWindow: (info) ? info : this.markerCurrentInfoWindow
        };
        // update report marker
        content = this.mapService.createComponent(data, MarkerRecovredReportComponent, this.recovredFormReport);
        info.setContent(content);
        info.setZIndex(1000);
        // show report informations
        content = this.mapService.createComponent(report, MarkerDetailsComponent, this.infosReport);
        this.addInfoWindow(currentMareker, content, 'hover');
      } else {
        content = this.mapService.createComponent(report, MarkerDetailsComponent, this.infosReport);
        this.addInfoWindow(currentMareker, content);
      }
    }

    return currentMareker;
  }

  private addInfoWindow(marker: google.maps.Marker, content = null, event= 'click'): google.maps.InfoWindow {
    log.debug('init infowindow on marker');
    const infoWindow = new google.maps.InfoWindow({
      content
    });
    const markerMap = marker.getMap();

    if (event === 'click') {
      google.maps.event.addListener(marker, event, () => infoWindow.open(markerMap, marker) );
    } else if (event === 'hover') {
      google.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(markerMap, marker));
      google.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());
    }

    return infoWindow;
  }

  private addEventsUserMarker() {
    this.addEventUserMarker(this.markerCurrentPosition, 'dragend');
    this.addEventUserMarker(this.map, 'dblclick');
  }

  private addEventUserMarker(eltOnEvent, event) {
    google.maps.event.addListener(eltOnEvent, event, (e) => {
      this.mapService.position = {
        lng: e.latLng.lng(),
        lat: e.latLng.lat()
      };

      if (event === 'dblclick') {
        this.initMarkerUser(this.mapService.markerUserOption());
      }
    });
  }
}
