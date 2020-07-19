import { TranslateService } from '@ngx-translate/core';
import { MarkerDetailsComponent} from '../components/marker-details/marker-details.component';
import { AuthService } from '@Services/auth.service';
import {Address, Position, Report} from '@Models/report.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { ReportService } from '@Services/report.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Const } from 'src/environments/const';
import { MapLegendComponent } from 'src/app/shared/map-legend/map-legend.component';
import { NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '@Services/logger.service';
import { convertSecondsToDate, dayDiff } from '@Helpers/date.helper';
import {MarkerCreateReportComponent} from '../components/marker-create-report/marker-create-report.component';
import {MarkerRecovredReportComponent} from '../components/marker-recovred-report/marker-recovred-report.component';

declare const MarkerClusterer: any;
const log = new Logger('map-view.component');

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./map-view.component.scss'],
  providers: [NgbTooltipConfig]
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(MarkerCreateReportComponent, {read: ElementRef})
  private createReportFormElt: ElementRef;
  @ViewChild(LoadingComponent, {read: ElementRef})
  private loadingElt: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild('btnAddReport', {static: false})
  private btnAddReport: ElementRef;
  @ViewChild('recovredFormReport', { read: ViewContainerRef })
  private recovredFormReport: ViewContainerRef;
  @ViewChild('infosReport', { read: ViewContainerRef })
  private infosReport: ViewContainerRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private markerCluster: any;
  private markerCurrentInfoWindow: google.maps.InfoWindow;
  private position: Position;
  @ViewChild('tleft') public tooltip: NgbTooltip;
  isError = false;
  markerCurrentPosition: google.maps.Marker;
  isFormLightCutOf = false;
  reports: Report[];
  lastReport: any;
  formLoader: boolean;
  isLoader = true;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private translateService: TranslateService,
    config: NgbTooltipConfig
  ) {
    config.placement = 'left';
    config.closeDelay = 3000;
   }

  ngOnInit(): void {
    log.debug('init');
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.mapsApiLoader.load().then(
      () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( position => {
            log.debug('position user found');
            this.isLoader = false;
            this.isFormLightCutOf = true;
            this.position = {
              lng: +position.coords.longitude,
              lat: +position.coords.latitude
            } as Position;

            this.initMap();
            this.initCurrentMarker(this.getUserMarkerOption());
            this.LoadReports();
            this.addEventsUserMarker();
            this.initTooltip();
          },
          () => {
            log.error('error geolocalization');
            this.toastrService.error(this.translateService.instant('main.map-view.error_geolocalize_not_work'));
          } );
        } else {
          log.error('Your browser does not support Geolocation');
          this.toastrService.error(this.translateService.instant('main.map-view.error_geolocalize_no_browser'));
        }
      },
        () => this.isError = true
      );
  }

  onCreateReport(event: any) {
    const geocoder = new google.maps.Geocoder();
    const errorMessage = this.translateService.instant('main.map-view.error_no_cameroon');
    let result = null;

    geocoder.geocode({location: this.position}, (results, status) => {
      if (status === 'OK') {
        result = results[1];
        if (result) {
          const locality = this.getLocality(result);
          const country = locality[1];

          if (country === 'Cameroun' || country === 'Cameroon') {
            log.debug('current user found in Camoeroon');
            this.createReport(
              event,
              this.getAddresses(results),
              locality
            );
          } else {
            log.error('current user no found in Camoeroon', result);
            this.toastrService.error(errorMessage, 'Error');
          }
        } else {
          log.error('No result found', result);
          this.toastrService.error(errorMessage, 'Error');
        }
      }
    });
  }

  /**
   * Search place in map
   */
  onSearchPlace(event: { query: any; }) {
    const service = new google.maps.places.PlacesService(this.map);
    const request = {
      query: event.query,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        log.debug('your place found');
        // for (let i = 0; i < results.length; i++) {
        //   const location = results[0].geometry.location;
        // }
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(14);
      }else {
        log.error('your place not found');
        this.toastrService.error('main.map-view.no_place');
      }
    });
  }

  openInfoWindowCreateReport() {
    google.maps.event.trigger(this.markerCurrentPosition, 'click');
  }

  private initTooltip() {
    this.tooltip.open();
    setTimeout(() => {
      log.debug('tooltip close after 3 seconds');
      this.tooltip.close();
    }, 5000);
  }

  private createReport(query, addresses, location) {
    this.isLoader = true;
    this.formLoader = true;

    const report = {
      addresses,
      country: location[1],
      city: location[0],
      position: this.position,
      reportedAt: this.reportService.fromDate(new Date(query)),
    } as Report;

    this.markerCurrentInfoWindow.setContent(this.loadingElt.nativeElement);

    this.reportService.addReport(report).then(
      resp => {
        log.debug('report create');
        this.formLoader = false;
        this.lastReport = report;
        this.lastReport.id = resp.path.valueOf().split('/')[1];

        this.reportService.updateReport(this.lastReport).then(
          () => {
            const recovredFromElement = this.createRecovredComponent(this.lastReport);
            this.markerCurrentInfoWindow.setContent(recovredFromElement);
            this.markerCurrentPosition.setDraggable(false);
            this.markerCurrentPosition.setOpacity(0);
            this.toastrService.success(this.translateService.instant('main.map-view.signalement_add'));
          },
          err => log.error('report not update', err)
        );
      },
      err => log.error('report not create', err)
    );
  }

  /**
   * return country and city
   *
   */
  private getLocality(address): string[] {
    const resultCountry = address.formatted_address.split(', ');
    const country = resultCountry[resultCountry.length - 1];
    const city = resultCountry[resultCountry.length - 2];
    return [city, country];
  }

  /**
   * format address from google map API
   *
   */
  private getAddresses(addresses): Address[] {
    // delete last element for array
    addresses.pop();
    return addresses.map(
      (data) => {
        return {
          label: data.formatted_address,
          types: data.types,
          placeId: data.place_id
        };
      }
    );
  }

  private initMap() {
    log.debug('init map');
    this.mapOptions = {
      center: this.position,
      zoom: 12,
      restriction: {
        latLngBounds: {
          east: Const.coordsCameroon.east,
          north: Const.coordsCameroon.north,
          south: Const.coordsCameroon.south,
          west: Const.coordsCameroon.west
        },
        // strictBounds: true
      },
      disableDoubleClickZoom: true,
      backgroundColor: '#eaeaea',
      mapTypeControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.legends.nativeElement);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.btnAddReport.nativeElement);
  }

  private initCurrentMarker(markerOption: google.maps.MarkerOptions) {
    log.debug('init current marker');
    if (this.markerCurrentPosition) {
      this.markerCurrentPosition.setMap(null);
      this.markerCurrentPosition = null;
    }

    this.markerCurrentPosition = new google.maps.Marker(markerOption);
    this.markerCurrentPosition.setMap(this.map);

    if (this.authService.getUser()){
      log.debug('add to current marker reported form in infos window');
      this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, this.createReportFormElt.nativeElement);
    } else {
      log.debug('current user are not identifiert');
      const content = 'Vous n\'avez pas pu être identifié. Pour faire un signalement vous devez l\'être.';
      this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, content);
    }
  }

  private LoadReports() {
    const reportsStarted = [];
    const reportsEnded = [];
    this.reportService.getReports()
      .subscribe(data => {
        data.forEach(report => {
          log.debug('load reports');
          if (report.recovredAt === null){
            reportsStarted.push(this.factoryOldMarkers(report));
          } else {
            const dateREcovred = convertSecondsToDate(report.recovredAt.seconds);
            if (dayDiff(dateREcovred, new Date()) <= 1) {
              reportsEnded.push(this.factoryOldMarkers(report));
            }
          }
        });
        this.addMarkersToCluster(reportsStarted);
      },
      err => log.error('report not load', err)
      );
  }

  private addMarkersToCluster(markers: google.maps.Marker[]) {
    log.debug('create clusters');
    this.markerCluster = new MarkerClusterer(
      this.map,
      markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );
  }

  private factoryOldMarkers(report: Report): google.maps.Marker {
    log.debug('factory marker', report);
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
      content = this.createInfoReportComponent(report);
      this.initOverInfoWindowMarker(currentMareker, content);
    } else {
      if (this.authService.getUser().id === report._createdBy.id){
        content = this.createRecovredComponent(report);
        this.initClickInfoWindow(currentMareker, content);
      } else {
        content = this.createInfoReportComponent(report);
        this.initOverInfoWindowMarker(currentMareker, content);
      }
    }

    return currentMareker;
  }

  private initClickInfoWindow(marker: google.maps.Marker, content: any): google.maps.InfoWindow {
    log.debug('init event click on marker');
    const infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(marker.getMap(), marker);
    });

    return infoWindow;
  }

  private initOverInfoWindowMarker(mareker: google.maps.Marker, content: any) {
    log.debug('init event over on marker');
    const infoWindow = new google.maps.InfoWindow({
      content
    });

    mareker.addListener('mouseover', () => infoWindow.open(this.map, mareker));
    mareker.addListener('mouseout', () => infoWindow.close());
  }

  private createRecovredComponent(report: Report): any {
    log.debug('create recovred form component');
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MarkerRecovredReportComponent);

    const viewContainerRef = this.recovredFormReport;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as MarkerRecovredReportComponent).data = report;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }

  private createInfoReportComponent(report: Report): any {
    log.debug('create info report component');
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MarkerDetailsComponent);

    const viewContainerRef = this.infosReport;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as MarkerDetailsComponent).data = report;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }

  private addEventsUserMarker() {
    this.addEventDragableUserMarker();
    this.addEventDblClickUserMarker();
  }

  private addEventDragableUserMarker(){
    log.debug('add event draggable to current marker');
    google.maps.event.addListener(this.markerCurrentPosition, 'dragend', (e) => {
      this.position = {
        lng: e.latLng.lng(),
        lat: e.latLng.lat()
      } as Position;
    });
  }

  private addEventDblClickUserMarker() {
    log.debug('add event click to current marker');
    google.maps.event.addListener(this.map, 'dblclick', (e) => {
      this.position = {
        lng: +e.latLng.lng(),
        lat: +e.latLng.lat()
      } as Position;
      this.initCurrentMarker(this.getUserMarkerOption());
    });
  }

  private getUserMarkerOption() {
    return {
      position: this.position,
      label: 'Votre position',
      icon: {
        url: Const.markerColor.user
      },
      draggable: true,
      zIndex: 2000
    };
  }
}
