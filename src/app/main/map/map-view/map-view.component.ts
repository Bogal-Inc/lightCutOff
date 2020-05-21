import MarkerClusterer, { MarkerClustererOptions } from '@google/markerclusterer'
import { SelectCurrentMarkerComponent } from './../components/select-current-marker/select-current-marker.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', {static: false})
  private gmap: ElementRef;
  @ViewChild(SelectCurrentMarkerComponent, {read: ElementRef})
  private formLightCutOff: ElementRef;
  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private coordinates: google.maps.LatLng;

  markerCurrentPosition: google.maps.Marker;
  markers = [
    // These are all just random coordinates from https://www.random.org/geographic-coordinates/
    { lat: 4.0520564, lng: 9.7618687 },
    { lat: 4.0530564, lng: 9.7628687 },
    { lat: 4.0540564, lng: 9.7638687 },
    { lat: 4.0550564, lng: 9.7648687 },
    { lat: 4.0560564, lng: 9.7658687 },
    { lat: 4.0570564, lng: 9.7668687 }
  ];

  constructor(
    private mapsApiLoader: MapsAPILoader,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mapInitializer();
  }

  private mapInitializer() {
    this.mapsApiLoader.load().then(() => {
      navigator.geolocation.getCurrentPosition( position => {
        const lng = +position.coords.longitude;
        const lat = +position.coords.latitude;
        this.coordinates = new google.maps.LatLng(lat, lng);

        this.initMap();

        this.addCurrentMarkerToMap({
          position: this.coordinates,
          label: 'Votre position'
        });

        // const markerCurrentPosition = new MarkerClusterer(
        //   this.map,
        //   this.markers,
        //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
        // );

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

  private addCurrentMarkerToMap(markerOption: google.maps.MarkerOptions) {
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
    for (let i = 0; i < this.markers.length; i++) {
      let coords = new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng);
      let marker = new google.maps.Marker({
        position: coords,
        opacity: 0.5
      });
      marker.setMap(this.map);
    }
  }
}
