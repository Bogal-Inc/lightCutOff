import { Position } from './../../../core/models/report.model';
import { ReportService } from './../../../store/report/report.service';
import { ReportRecovredFormComponent } from '../components/report-recovred-form/report-recovred-form.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Report } from 'src/app/core/models/report.model';
import * as uuid from 'uuid';
import { ngbToDate } from 'src/app/core/_helper/ngbToFbTimestamp.cast';
import { ToastrService } from 'ngx-toastr';
import { compareDate } from 'src/app/core/_helper/compareDate.validator';

declare const MarkerClusterer: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(ReportRecovredFormComponent, {read: ElementRef})
  private formLightCutOff: ElementRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private markerCluster: any;
  private infoWindow: google.maps.InfoWindow;
  isFormLightCutOf = false;
  private coordinates: google.maps.LatLng;
  markerCurrentPosition: google.maps.Marker;
  reports: Report[];
  private position: Position;
  lastReport: Report;
  formLoader: boolean;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.reportService.getReports().subscribe(data => {
    //   console.log(data);
    // });
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnDestroy() { }

  mapInitializer() {
    this.mapsApiLoader.load().then(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          const lng = +position.coords.longitude;
          const lat = +position.coords.latitude;
          this.position = {lng, lat};
          this.isFormLightCutOf = true;
          this.coordinates = new google.maps.LatLng(lat, lng);

          this.initMap();
          this.initCurrentMarkerToMap({
            position: this.coordinates,
            label: 'Votre position',
            draggable: true
          });
          this.generateMarkerExple();
          this.reloadCurrentPosition();
        }, () => {
          this.toastr.error('Le service de geolocalisation ne fonctionne pas', 'Actualisez');
        } );
      } else {
        this.toastr.error('Votre navigateur ne supporte Geolocation');
      }
    });
  }

  onReportSubmit(event) {
    this.formLoader = true;
    const report = {
      id: uuid.v4(),
      createdAt: ngbToDate(),
      deletedAt: null,
      position: this.position,
      reportedAt: ngbToDate(event.reportedAt, event.reportedHour),
      recovredAt: null,
      updatedAt: null,
      url: null
    };

    this.reportService.createReport(report).then(
      resp => {
        this.formLoader = false;
        this.lastReport = report;
        this.lastReport.url = resp.path.valueOf();
        this.markerCurrentPosition.setDraggable(false);
        this.toastr.success('Merci', 'Rapport ajouté');
      }
    );
  }

  onRecovredSubmit(event) {
    this.formLoader = true;
    this.lastReport.recovredAt = ngbToDate(event.recovredAt, event.recovredHour);
    this.lastReport.updatedAt = ngbToDate();

    if (!compareDate(this.lastReport.recovredAt, this.lastReport.reportedAt)) {
      this.formLoader = false;
      this.toastr.error('La date de créatioon du rapport doit être supérieur à la date de fin', 'Erreur');
      return ;
    }

    this.reportService.updateReport(this.lastReport).then(
      resp => {
        this.formLoader = false;
        this.lastReport = null;
        this.markerCurrentPosition.setDraggable(true);
        this.infoWindow.close();
        this.toastr.success('Merci', 'Rapport modifié');
      }
    );
  }

  private reloadCurrentPosition(){
    google.maps.event.addListener(this.markerCurrentPosition, 'dragend', (data) => {
      const pos = this.markerCurrentPosition.getPosition();
      const lng = pos.lng();
      const lat = pos.lat();
      this.position = {lng, lat};
      this.coordinates = new google.maps.LatLng(lat, lng);
    });
  }

  private initMap() {
    this.mapOptions = {
      center: this.coordinates,
      zoom: 12,
      backgroundColor: '#eaeaea',
      mapTypeControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
  }

  private initCurrentMarkerToMap(markerOption: google.maps.MarkerOptions) {
    this.markerCurrentPosition = new google.maps.Marker(markerOption);
    this.markerCurrentPosition.setMap(this.map);

    this.infoWindow = new google.maps.InfoWindow({
      content: this.formLightCutOff.nativeElement,
    });

    google.maps.event.addListener(this.markerCurrentPosition, 'click', (data) => {
      this.infoWindow.open(this.markerCurrentPosition.getMap(), this.markerCurrentPosition);
    });
  }

  private generateMarkerExple() {
    const locations = [
      // These are all just random coordinates from https://www.random.org/geographic-coordinates/
      { lat: 4.0520564, lng: 9.7618687 },
      { lat: 4.0530564, lng: 9.7628687 },
      { lat: 4.0540564, lng: 9.7638687 },
      { lat: 4.0550564, lng: 9.7648687 },
      { lat: 4.0560564, lng: 9.7658687 },
      { lat: 4.0570564, lng: 9.7668687 },
      { lat: 4.0520564, lng: 9.7618687 },
      { lat: 4.0530564, lng: 9.7628687 },
      { lat: 4.0540564, lng: 9.7638687 },
      { lat: 4.0550564, lng: 9.7648687 },
      { lat: 4.0560564, lng: 9.7658687 },
      { lat: 4.0570564, lng: 9.7668687 },
      { lat: 4.0520564, lng: 9.7618687 },
      { lat: 4.0530564, lng: 9.7628687 },
      { lat: 4.0540564, lng: 9.7638687 },
      { lat: 4.0550564, lng: 9.7648687 },
      { lat: 4.0560564, lng: 9.7658687 },
      { lat: 4.0570564, lng: 9.7668687 },
      { lat: 4.0520564, lng: 9.7618687 },
      { lat: 4.0530564, lng: 9.7628687 },
      { lat: 4.0540564, lng: 9.7638687 },
      { lat: 4.0550564, lng: 9.7648687 },
      { lat: 4.0560564, lng: 9.7658687 },
      { lat: 4.0570564, lng: 9.7668687 }
    ];
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const markers = locations.map((location, i) => {
      const marker = new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
      return marker;
    });

    this.markerCluster = new MarkerClusterer(
      this.map,
      markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );
  }

  private getCurrentMarkerOption(): google.maps.MarkerOptions {
    return {
      position: this.coordinates,
      label: 'Votre position',
      draggable: true
    };
  }
}
