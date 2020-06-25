import { ReportInfosComponent } from './../components/report-infos/report-infos.component';
import { AuthService } from '@Services/auth.service';
import { Position, Report } from '@Models/report.model';
import { LoadingComponent } from './../../../shared/loading/loading.component';
import { UpdateFormReportComponent } from './../components/update-form-report/update-form-report.component';
import { CreateFormReportComponent } from './../components/create-form-report/create-form-report.component';
import { ReportService } from '@Services/report.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Const } from 'src/environments/const';
import { MapLegendComponent } from 'src/app/shared/map-legend/map-legend.component';

declare const MarkerClusterer: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(CreateFormReportComponent, {read: ElementRef})
  private createReportFormElt: ElementRef;
  @ViewChild(LoadingComponent, {read: ElementRef})
  private loadingElt: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild('recovredFormReport', { read: ViewContainerRef })
  private recovredFormReport: ViewContainerRef;
  @ViewChild('infosReport', { read: ViewContainerRef })
  private infosReport: ViewContainerRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private markerCluster: any;
  private markerCurrentInfoWindow: google.maps.InfoWindow;
  private position: Position;
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
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.mapsApiLoader.load().then(
      () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( position => {
            this.isLoader = false;
            this.isFormLightCutOf = true;
            this.position = {
              lng: +position.coords.longitude,
              lat: +position.coords.latitude
            };

            this.initMap();
            this.initCurrentMarker(this.getUserMarkerOption());
            this.LoadReports();
            this.addEventsUserMarker();
          },
          () => {
            this.toastr.error('Le service de geolocalisation ne fonctionne pas', 'Actualisez');
          } );
        } else {
          this.toastr.error('Votre navigateur ne supporte Geolocation');
        }
      },
        () => {
          this.isError = true;
      });
  }

  onCreateReport(event: any) {
    this.isLoader = true;
    this.formLoader = true;
    if (!this.isMarkerCountry()) {
      this.isLoader = false;
      this.formLoader = false;
      this.toastr.error('Vous ne pouvez pas creer de rapport hors du territoire Camerounais', 'Error');
      return;
    }

    const report = {
      position: this.position,
      reportedAt: event,
      _createdAt: event
    } as Report;

    this.markerCurrentInfoWindow.setContent(this.loadingElt.nativeElement);

    this.reportService.addReport(report).then(
      resp => {
        this.formLoader = false;
        this.lastReport = report;
        this.lastReport.url = resp.path.valueOf();

        this.reportService.updateReport(this.lastReport).then(
          () => {
            const recovredFromElement = this.createRecovredComponent(this.lastReport);
            this.markerCurrentInfoWindow.setContent(recovredFromElement);
            this.markerCurrentPosition.setDraggable(false);
            this.markerCurrentPosition.setOpacity(0);
            this.toastr.success('Merci', 'Rapport ajouté');
          }
        );
      }
    );
  }

  /**
   * Search place in map
   */
  onSearchPlace(event) {
    const service = new google.maps.places.PlacesService(this.map);
    const request = {
      query: event.query,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // for (let i = 0; i < results.length; i++) {
        //   const location = results[0].geometry.location;
        // }
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(14);
      }else {
        this.toastr.error('La place rechercher est introuvable', 'Erreur');
      }
    });
  }

  /**
   * detect country for current position
   */
  private isMarkerCountry(): boolean {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({location: this.position}, (results, status) => {
      if (status === 'OK') {

        if (results[1]) {
          const resultCountry = results[1].formatted_address.split(',', 2);
          if (resultCountry[1] === 'Cameroun' || resultCountry[1] === 'Cameroon') {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    return false;
  }

  private initMap() {
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
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(this.legends.nativeElement);
  }

  private initCurrentMarker(markerOption: google.maps.MarkerOptions) {
    if (this.markerCurrentPosition) {
      this.markerCurrentPosition.setMap(null);
      this.markerCurrentPosition = null;
    }

    this.markerCurrentPosition = new google.maps.Marker(markerOption);
    this.markerCurrentPosition.setMap(this.map);

    if (this.authService.getUser()){
      this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, this.createReportFormElt.nativeElement);
    } else {
      const content = 'Vous n\'avez pas pu être identifié. Pour faire un rapport vous devez l\'être.';
      this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, content);
    }
  }

  private LoadReports() {
    const markCut = [];
    const markRec = [];
    this.reportService.getReports()
      .subscribe(data => {
        data.forEach(report => {
          if (report.recovredAt === null){
            markCut.push(this.factoryOldMarkers(report));
          } else {
            markRec.push(this.factoryOldMarkers(report));
          }
        });
        this.addMarkersToCluster(markCut);
      });
  }

  private addMarkersToCluster(markers: google.maps.Marker[]) {
    this.markerCluster = new MarkerClusterer(
      this.map,
      markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );
  }

  private factoryOldMarkers(report: Report): google.maps.Marker {
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
    const infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(marker.getMap(), marker);
    });

    return infoWindow;
  }

  private initOverInfoWindowMarker(mareker: google.maps.Marker, content: any) {
    const infoWindow = new google.maps.InfoWindow({
      content
    });

    mareker.addListener('mouseover', () => infoWindow.open(this.map, mareker));
    mareker.addListener('mouseout', () => infoWindow.close());
  }

  private createRecovredComponent(report: Report): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateFormReportComponent);

    const viewContainerRef = this.recovredFormReport;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as UpdateFormReportComponent).data = report;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }

  private createInfoReportComponent(report: Report): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReportInfosComponent);

    const viewContainerRef = this.infosReport;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ReportInfosComponent).data = report;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }

  private addEventsUserMarker() {
    this.addEventDragableUserMarker();
    this.addEventDblClickUserMarker();
  }

  private addEventDragableUserMarker(){
    google.maps.event.addListener(this.markerCurrentPosition, 'dragend', (data) => {
      const pos = this.markerCurrentPosition.getPosition();
      this.position = {lng: pos.lng(), lat: pos.lat()};
    });
  }

  private addEventDblClickUserMarker() {
    google.maps.event.addListener(this.map, 'dblclick', (data) => {
      this.position = {
        lng: +data.latLng.lng(),
        lat: +data.latLng.lat()
      };

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
