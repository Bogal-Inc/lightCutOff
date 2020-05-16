import { IMarker } from './../../../core/models/marker.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  currentPosition: IMarker;
  currentPositionMap: IMarker;
  zoom: number;

  constructor() {}

  ngOnInit(): void {
    this.zoom = 15;
    navigator.geolocation.getCurrentPosition( position => {
      this.currentPosition = {
        latitude: +position.coords.latitude,
        longitude: +position.coords.longitude,
        alpha: 1
      };
      this.currentPositionMap = {
        latitude: +position.coords.latitude,
        longitude: +position.coords.longitude,
        alpha: 1
      };
    });
  }

  actuMarker(latitude: number, longitude: number)  {
    this.currentPosition = {
      latitude,
      longitude,
      alpha: 1
    };
  }

}
