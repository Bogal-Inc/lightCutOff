import { Marker } from './../../../core/models/marker.model';
import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  currentPosition: Marker;
  map: Mapper;
  markers = [
    // These are all just random coordinates from https://www.random.org/geographic-coordinates/
    { lat: 4.0520564, lng: 9.7618687, alpha: 0.5 },
    { lat: 4.0530564, lng: 9.7628687, alpha: 0.5 },
    { lat: 4.0540564, lng: 9.7638687, alpha: 0.5 },
    { lat: 4.0550564, lng: 9.7648687, alpha: 0.5 },
    { lat: 4.0560564, lng: 9.7658687, alpha: 0.5 },
    { lat: 4.0570564, lng: 9.7668687, alpha: 0.5 }
  ];

  constructor(
    private mapsApiLoader: MapsAPILoader,
  ) {}

  ngOnInit(): void {
    this.mapsApiLoader.load().then(() => {
      this.initMap();
    });
  }

  private initMap() {
    navigator.geolocation.getCurrentPosition( position => {
      const lgt = +position.coords.longitude;
      const lat = +position.coords.latitude;

      this.map = {
        latitude: lat,
        longitude: lgt,
        zoom: 13,
        streetViewControl: false
      };

      this.currentPosition = this.initCurrentMarker(lat, lgt);
    });
  }

  selectMarker(event) {
    console.log("hello world")
  }

  currentMarker(latitude: number, longitude: number)  {
    this.currentPosition = this.initCurrentMarker(latitude, longitude);
  }

  private initCurrentMarker(latitude: number, longitude: number): Marker {
    return {
      latitude,
      longitude,
      alpha: 1,
      draggable: true,
      title: 'Votre position'
    };
  }
}
