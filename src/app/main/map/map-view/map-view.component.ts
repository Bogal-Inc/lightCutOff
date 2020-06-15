import { LoadingComponent } from './../../../shared/loading/loading.component';
import { UpdateFormReportComponent } from './../components/update-form-report/update-form-report.component';
import { CreateFormReportComponent } from './../components/create-form-report/create-form-report.component';
import { MapLegendComponent } from './../components/map-legend/map-legend.component';
import { Position } from 'src/app/core/models/report.model';
import { ReportService } from 'src/app/core/services/report.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Report } from 'src/app/core/models/report.model';
import { ngbToDate } from 'src/app/core/_helper/ngbToFbTimestamp.cast';
import { ToastrService } from 'ngx-toastr';
import { compareDate } from 'src/app/core/_helper/compareDate.validator';
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
  @ViewChild(UpdateFormReportComponent, {read: ElementRef})
  private updateReportFormElt: ElementRef;
  @ViewChild(LoadingComponent, {read: ElementRef})
  private loadingElt: ElementRef;
  @ViewChild(MapLegendComponent, {read: ElementRef})
  private legends: ElementRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private markerCluster: any;
  private infoWindow: google.maps.InfoWindow;
  private position: Position;
  markerCurrentPosition: google.maps.Marker;
  isFormLightCutOf = false;
  reports: Report[];
  lastReport: any;
  formLoader: boolean;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService,
    private toastr: ToastrService,
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
          this.isFormLightCutOf = true;
          this.position = {
            lng: +position.coords.longitude,
            lat: +position.coords.latitude
          };

          this.initMap();

          this.initCurrentMarker(this.getUserMarkerOption());
          this.initOtherMarkers();

          this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(this.legends.nativeElement);
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
    this.formLoader = true;
    const report = {
      position: this.position,
      reportedAt: ngbToDate(event.reportedAt, event.reportedHour),
    };
    this.infoWindow.setContent(this.loadingElt.nativeElement);

    this.reportService.addReport(report).then(
      resp => {
        this.formLoader = false;
        this.lastReport = report;
        this.lastReport.url = resp.path.valueOf();

        this.reportService.updateReport(this.lastReport).then(
          () => {
            this.markerCurrentPosition.setDraggable(false);
            this.toastr.success('Merci', 'Rapport ajouté');
          }
        );
        this.infoWindow.setContent(this.updateReportFormElt.nativeElement);
      }
    );
  }

  onRecovredReport(event) {
    this.formLoader = true;
    this.lastReport.recovredAt = ngbToDate(event.recovredAt, event.recovredHour);
    this.lastReport._updatedAt = ngbToDate();

    if (!compareDate(this.lastReport.recovredAt, this.lastReport.reportedAt)) {
      this.formLoader = false;
      this.toastr.error('La date de créatioon du rapport doit être supérieur à la date de fin', 'Erreur');
      return ;
    }
    this.infoWindow.setContent(this.loadingElt.nativeElement);

    this.reportService.updateReport(this.lastReport).then(
      () => {
        this.formLoader = false;
        this.lastReport = null;
        this.markerCurrentPosition.setDraggable(true);
        this.infoWindow.close();
        this.infoWindow.unbindAll();
        this.initCurrentInfoWindow(this.createReportFormElt.nativeElement);
        this.toastr.success('Merci', 'Rapport modifié');
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
        this.initCurrentInfoWindow(this.createReportFormElt.nativeElement);
      } else {
        this.initCurrentInfoWindow('Vous n\'avez pas pu être identifié. Pour faire un rapport vous devez l\'être.');
      }
    });


  }

  private initCurrentInfoWindow(content) {
    this.infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(this.markerCurrentPosition, 'click', () => {
      this.infoWindow.open(this.markerCurrentPosition.getMap(), this.markerCurrentPosition);
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
    const currentMareker = new google.maps.Marker({
        position: new google.maps.LatLng(+report.position.lat, +report.position.lng),
        icon: {
          url: (report.recovredAt === null) ? Const.markerColor.cut : Const.markerColor.recovred
        },
        map: this.map
    });

    const currentInfoWindow = new google.maps.InfoWindow({
      content: this.getContentMarherInformations(report)
    });
    currentMareker.addListener('mouseover', () => currentInfoWindow.open(this.map, currentMareker));
    currentMareker.addListener('mouseout', () => currentInfoWindow.close());

    return currentMareker;
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
            <li>Coupe le: ${new Date(report.reportedAt).toUTCString()}</li>
            <li>Remis le: ${(report.recovredAt) ? new Date(report.recovredAt)?.toUTCString() : 'Aucune notification'}</li>
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
      draggable: true
    };
  }
}
