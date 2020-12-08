import {TranslateService} from '@ngx-translate/core';
import {MarkerDetailsComponent} from '../components/marker-details/marker-details.component';
import {AuthService} from '../../../core/services-firebase';
import {Position, Report, ReportSatus} from '@Models/report.model';
import {LoadingComponent} from '../../../shared/loading/loading.component';
import {ReportService} from '../../../core/services-firebase';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {ToastrService} from 'ngx-toastr';
import {Const} from 'src/environments/const';
import {MapLegendComponent} from 'src/app/main/map/components/map-legend/map-legend.component';
import {NgbModal, NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {Logger} from '@Services/logger.service';
import {MarkerCreateReportComponent} from '../components/marker-create-report/marker-create-report.component';
import {MarkerRecovredReportComponent} from '../components/marker-recovred-report/marker-recovred-report.component';
import {MetaService} from '@Services/meta.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ComponentService} from '@Services/component.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {MapTutoModalComponent} from '../components/map-tuto-modal/map-tuto-modal.component';
import {MapFilterComponent} from '../components/map-menu/components/map-filter/map-filter.component';
import {MapMenuComponent} from '../components/map-menu/map-menu.component';
import {MapModel} from '@Models/map.model';

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
  @ViewChild('btnSwitchForm', {static: false})
  private btnSwitchForm: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild(MapFilterComponent, {read: ElementRef})
  public mapFilter: ElementRef;
  @ViewChild(MapMenuComponent, {read: ElementRef})
  public MapMenuComponent: ElementRef;
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
  isloaderMap = false;
  unsubsscribe$ = new Subject<void>();
  reportsMarkers: any;
  markersClusters;
  reportAdd: Report;
  private mapM: MapModel;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private mapService: ComponentService,
    private analytics: AngularFireAnalytics,
    private modalService: NgbModal,
    config: NgbTooltipConfig
  ) {
    config.placement = 'left';
    config.closeDelay = 3000;
   }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/map',
      page_path: '/map',
      page_title: 'Map'
    });

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
    });
  }

  onCreateReport(event: any) {
    log.debug('create report');
    this.analytics.logEvent('added_report');

    const geocoder = new google.maps.Geocoder();
    const errorMessage = this.translateService.instant('main.map-view.error_no_cameroon');
    let googleLocation = null;

    geocoder.geocode(
      {location: this.mapM.position},
      (googleLocations, status) => {
        if (status === 'OK') {
        googleLocation = googleLocations[1];

        if (googleLocation) {
          const locality = this.mapM.getCountryCity(googleLocation);
          const country = locality[1];

          if (country === 'Cameroun' || country === 'Cameroon') {
            this.createReport(
              event,
              this.mapM.getAddresses(googleLocations, locality)
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

  openInfoWindowCreateReport() {
    this.analytics.logEvent('plus_button_add_report');
    google.maps.event.trigger(this.markerCurrentPosition, 'click');
  }

  goToMarker(report: Report) {
    this.map.setCenter(report.position);
    this.map.setZoom(14);
    const marker = this.markerFactory(report);
    google.maps.event.trigger(marker, 'click');
  }

  /**
   * @description determine if after add report to update report
   * @param elt yes or no show recovered form
   */
  switchForm(elt: boolean) {
    log.debug('choice form', elt);
    this.analytics.logEvent('go_to_recovredForm', {
      accept: elt
    });

    if (elt) {
      const data = {
        report: this.reportAdd,
        markerCurrentInfoWindow: this.markerCurrentInfoWindow
      };

      const recovredFromElement = this.mapService.createComponent(
        data,
        MarkerRecovredReportComponent,
        this.recovredFormReport
      );

      this.markerCurrentInfoWindow.setContent(recovredFromElement);
    } else {
      this.markerCurrentInfoWindow.close();
    }
  }

  mapFiltered(reportStatus: ReportSatus[]) {
    this.mapClear();
    const reportsResults = (reportStatus.length > 0) ? this.getReportsByStatus(reportStatus) : this.reports;
    this.addClusters(reportsResults);
  }

  private initTooltip() {
    this.tooltip.open();
    setTimeout(() => {
      log.debug('tooltip close after 3 seconds');
      this.tooltip.close();
    }, 5000);
  }

  private getReportsByStatus(reportsStatus: ReportSatus[]) {
    let reportsResults = [];
    reportsStatus.forEach(
      ev => {
        const reportsFilter = this.reports.filter(
          (report: Report) => {
            if (ev === ReportSatus.CUT_OWNER) {
              // the owner report status is not saved in database. it is saved in the cutoff status
              return (this.authService.getUser().id === report._createdBy.id) && (report.status === ReportSatus.CUT);
            } else if (ev === ReportSatus.CUT) {
              return (this.authService.getUser().id !== report._createdBy.id) && (report.status === ReportSatus.CUT);
            } else {
              return report.status === ev;
            }
          });
        reportsResults = reportsResults.concat(reportsFilter);
      });
    return reportsResults;
  }

  private mapClear() {
    this.markersClusters.setMap(null);
    this.reportsMarkers.forEach(marker => marker.setMap(null));
  }

  private createReport(query, location) {
    this.isLoader = true;
    this.formLoader = true;

    const report = {
      location,
      position: this.mapM.position,
      reportedAt: new Date(query),
    } as Report;

    this.markerCurrentInfoWindow.setContent(this.loadingElt.nativeElement);
    this.reportService.addReport(report).then(
      resp => {
        log.debug('report create');
        this.formLoader = false;
        report.id = resp.path.valueOf().split('/')[1];
        this.updateReport(report);
      },
      err => log.error('report not create')
    );
  }

  private updateReport(report: Report) {
    this.reportService.updateReport(report).then(
      () => {
        this.reportAdd = report;
        this.markerCurrentInfoWindow.setContent(this.btnSwitchForm.nativeElement);
        this.markerCurrentPosition.setDraggable(false);
        this.markerCurrentPosition.setOpacity(0);
        this.toastrService.success(this.translateService.instant('main.map-view.signalement_add'));
      },
      err => {
        log.error('report not update', err);
        this.formLoader = false;
      }
    );
  }

  private initMap(position: Position){
    this.isLoader = false;
    this.isFormLightCutOf = true;

    this.mapM = new MapModel(
      position,
      this.gmap.nativeElement,
      [
        this.legends?.nativeElement,
        this.btnAddReport?.nativeElement,
        this.mapFilter?.nativeElement
      ]
    );
    this.map = this.mapM.map;

    this.initMarkerUser(this.mapM.markerUserOption(this.translateService.instant('main.map-view.your_position')));
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

  private getReportStatusForSystem(reportStatus: ReportSatus): ReportSatus {
    if (
      reportStatus === ReportSatus.CUT_OWNER ||
      reportStatus === ReportSatus.CUT
    ) {
      return ReportSatus.CUT;
    } else if (reportStatus === ReportSatus.CUT_COMPLETED) {
      return ReportSatus.CUT_COMPLETED;
    }
  }

  private LoadReports(reportStatus?: ReportSatus) {
    log.debug('load reports');

    const now = new Date();
    let currentReportStatus = null;

    if (reportStatus) {
      currentReportStatus = this.getReportStatusForSystem(reportStatus);
    }

    this.reportService.getReports({
      isDeleted: false,
      reportStatus: (reportStatus) ? currentReportStatus : null,
      datestart: new Date(now.getFullYear(), 1, 1)
    })
      .pipe(
        takeUntil(this.unsubsscribe$)
      )
      .subscribe(
        (reports) => {
          // the reports closed from 24h is not visible on map
          this.reports = reports.filter(
            report => {
              if (report.status === ReportSatus.CUT_COMPLETED) {
                const recovredAt = report.recovredAt.toDate();
                const tomorrow = new Date(recovredAt.getTime() + 86400000);
                if (tomorrow > now) {
                  return report;
                }
              } else if (report.status === ReportSatus.CUT) {
                const reportedAt = report.reportedAt.toDate();
                const monthDiff = now.getMonth() - reportedAt.getMonth();
                if (monthDiff === 0 || monthDiff === 1) {
                  if (now.getDay() <= reportedAt.getDay()) {
                    return report;
                  }
                }
              } else {
                return report;
              }
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
   * @description create the marker, add in map and add infowindow with event for everyone
   * @param report: all report
   */
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
      // add detail component to recovred marker
      content = this.mapService.createComponent({report}, MarkerDetailsComponent, this.infosReport);
      this.addInfoWindow(currentMareker, content);
    } else {
      if (this.authService.getUser().id === report._createdBy.id){
        const infoWindow = this.addInfoWindow(currentMareker, content);
        const data = {
          report,
          markerCurrentInfoWindow: (infoWindow) ? infoWindow : this.markerCurrentInfoWindow
        };

        // component to update report marker for marker not recovred with owner same
        content = this.mapService.createComponent(data, MarkerRecovredReportComponent, this.recovredFormReport);
        infoWindow.setContent(content);
        infoWindow.setZIndex(1000);

        // component to see report informations for marker not recovred with owner same
        content = this.mapService.createComponent({report}, MarkerDetailsComponent, this.infosReport);
        this.addInfoWindow(currentMareker, content, 'hover');
      } else {
        // marker recovred not owner same
        content = this.mapService.createComponent({report}, MarkerDetailsComponent, this.infosReport);
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

  /**
   * @description add events drag and drop and double click in map to user marker position
   */
  private addEventsUserMarker() {
    this.addEventToMap(this.markerCurrentPosition, 'dragend');
    this.addEventToMap(this.map, 'dblclick');
  }

  private addEventToMap(eltOnEvent, event) {
    google.maps.event.addListener(eltOnEvent, event, (e) => {
      this.mapM.position = {
        lng: e.latLng.lng(),
        lat: e.latLng.lat()
      };

      if (event === 'dblclick') {
        this.initMarkerUser(this.mapM.markerUserOption(this.translateService.instant('main.map-view.your_position')));
      }
    });
  }

  private openTutoModal() {
    log.debug('open tutorial modal');
    this.analytics.logEvent('tutorial_begin');

    const tutoPassed = localStorage.getItem('tutoPassed');
    if (tutoPassed !== null) {
      return;
    }

    this.modalService.open(MapTutoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }
}
