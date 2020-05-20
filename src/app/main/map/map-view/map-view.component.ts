import { IMarker } from './../../../core/models/marker.model';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  currentPosition: IMarker;
  zoom: number;
  selectedCurrentMarker = false;
  markers = [
    // These are all just random coordinates from https://www.random.org/geographic-coordinates/
    { lat: 4.0520564, lng: 9.7618687, alpha: 0.5 },
    { lat: 4.0530564, lng: 9.7628687, alpha: 0.5 },
    { lat: 4.0540564, lng: 9.7638687, alpha: 0.5 },
    { lat: 4.0550564, lng: 9.7648687, alpha: 0.5 },
    { lat: 4.0560564, lng: 9.7658687, alpha: 0.5 },
    { lat: 4.0570564, lng: 9.7668687, alpha: 0.5 }
  ];

  constructor() {}

  ngOnInit(): void {
    this.zoom = 13;
    navigator.geolocation.getCurrentPosition( position => {
      this.currentPosition = {
        latitude: +position.coords.latitude,
        longitude: +position.coords.longitude,
        alpha: 1
      };
    });
  }

  selectMarker(event) {
    console.log("hello world")
  }

  currentMarker(latitude: number, longitude: number)  {
    this.currentPosition = {
      latitude,
      longitude,
      alpha: 1
    };
  }

  selectCurrentMarker(event) {
    if (this.selectedCurrentMarker) {
      this.selectedCurrentMarker = false;
    } else {
      this.selectedCurrentMarker = true;
    }
  }
}
