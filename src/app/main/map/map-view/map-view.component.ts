import { ReportService } from './../../../store/report/report.service';
import { SelectCurrentMarkerComponent } from './../components/select-current-marker/select-current-marker.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Report } from 'src/app/core/models/report.model';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase/app';

declare const MarkerClusterer: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(SelectCurrentMarkerComponent, {read: ElementRef})
  private formLightCutOff: ElementRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private coordinates: google.maps.LatLng;
  isFormLightCutOf = false;
  private markerCluster: any;
  markerCurrentPosition: google.maps.Marker;
  reports: Report[];
  reportSubscription: Subscription;

  constructor(
    private mapsApiLoader: MapsAPILoader,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.reportSubscription = this.reportService.reportsSubject.subscribe(
      (reports: Report[]) => {
        this.reports = reports;
      }
    );
    this.reportService.emitReports();
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.mapsApiLoader.load().then(() => {
      navigator.geolocation.getCurrentPosition( position => {
        const lng = +position.coords.longitude;
        const lat = +position.coords.latitude;
        this.coordinates = new google.maps.LatLng(lat, lng);
        this.initMap();
        this.isFormLightCutOf = true;

        this.initCurrentMarkerToMap(this.getCurrentMarkerOption());

        this.generateMarkerExple();
      });
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

    const infoWindow = new google.maps.InfoWindow({
      content: this.formLightCutOff.nativeElement
    });

    this.markerCurrentPosition.addListener('click', function() {
      infoWindow.open(this.getMap(), this);
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
