import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  latitude;
  longitude;
  zoom = 15;

  constructor() { }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition( position => {
      this.latitude = +position.coords.latitude;
      this.longitude = +position.coords.longitude;
    });
  }

}
