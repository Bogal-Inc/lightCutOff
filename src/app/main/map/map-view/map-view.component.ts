import { Position, Report } from 'src/app/core/models/report.model';
import { LoadingComponent } from './../../../shared/loading/loading.component';
import { UpdateFormReportComponent } from './../components/update-form-report/update-form-report.component';
import { CreateFormReportComponent } from './../components/create-form-report/create-form-report.component';
import { MapLegendComponent } from './../components/map-legend/map-legend.component';
import { ReportService } from 'src/app/core/services/report.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ngbToDate } from 'src/app/core/_helper/date.helper';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { Const } from 'src/environments/const';

declare const MarkerClusterer: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(CreateFormReportComponent, {read: ElementRef})
  private createReportFormElt: ElementRef;
  @ViewChild(LoadingComponent, {read: ElementRef})
  private loadingElt: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  @ViewChild('messagecontainer', { read: ViewContainerRef })
  private adHost: ViewContainerRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private markerCluster: any;
  private markerCurrentInfoWindow: google.maps.InfoWindow;
  private position: Position;
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
    private angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnDestroy() { }

  mapInitializer() {
    this.mapsApiLoader.load().then(() => {
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
          this.initOtherMarkers();
          this.addEvents();
        }, () => {
          this.toastr.error('Le service de geolocalisation ne fonctionne pas', 'Actualisez');
        } );
      } else {
        this.toastr.error('Votre navigateur ne supporte Geolocation');
      }
    });
  }

  onCreateReport(event) {
    this.isLoader = true;
    this.formLoader = true;
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
            const recovredFromElement = this.getUpdateRecovedComponent(this.lastReport);
            this.markerCurrentInfoWindow.setContent(recovredFromElement);
            this.markerCurrentPosition.setDraggable(false);
            this.markerCurrentPosition.setOpacity(0);
            this.toastr.success('Merci', 'Rapport ajouté');
          }
        );
      }
    );
  }

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
        strictBounds: true
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

    this.angularFireAuth.onAuthStateChanged(user => {
      if (user){
        this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, this.createReportFormElt.nativeElement);
      } else {
        const content = 'Vous n\'avez pas pu être identifié. Pour faire un rapport vous devez l\'être.';
        this.markerCurrentInfoWindow = this.initClickInfoWindow(this.markerCurrentPosition, content);
      }
    });
  }

  private initOtherMarkers() {
    const markCut = [];
    const markRec = [];
    this.reportService.getReports().subscribe(data => {
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

  private addMarkersToCluster(markers) {
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
          url: (report.recovredAt === null) ? Const.markerColor.cut : Const.markerColor.recovred
        },
        map: this.map
    });

    if (report.recovredAt) {
      content = this.getContentMarherInformations(report);
      this.initOverInfoWindowMarker(currentMareker, content);
    } else {
      content = this.getUpdateRecovedComponent(report);
      this.initClickInfoWindow(currentMareker, content);
    }

    return currentMareker;
  }

  private initClickInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(marker.getMap(), marker);
    });

    return infoWindow;
  }

  private initOverInfoWindowMarker(mareker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    });

    mareker.addListener('mouseover', () => infoWindow.open(this.map, mareker));
    mareker.addListener('mouseout', () => infoWindow.close());
  }

  private getUpdateRecovedComponent(report: Report): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateFormReportComponent);

    const viewContainerRef = this.adHost;
    // viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as UpdateFormReportComponent).report = report;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }

  private getContentMarherInformations(report: Report): string {
    return `
      <div class="marker-details">
        <div class="marker-details_header">
          Rapport
          <h3>Title</h3>
        </div>
        <div class="marker-details_body">
          <ul>
            <li>Coupé le: ${new Date(report.reportedAt.seconds * 1000).toUTCString()}</li>
            <li>Remis le: ${new Date(report.recovredAt.seconds * 1000).toUTCString()}</li>
            <li>Position: { lng: ${report.position.lng} lat: ${report.position.lat}}</li>
          </ul>
        </div>
      </div>
    `;
  }

  private addEvents() {
    this.onDragableGetPosition();
    this.onDblClickUserMarker();
  }

  private onDragableGetPosition(){
    google.maps.event.addListener(this.markerCurrentPosition, 'dragend', (data) => {
      const pos = this.markerCurrentPosition.getPosition();
      this.position = {lng: pos.lng(), lat: pos.lat()};
    });
  }

  private onDblClickUserMarker() {
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
