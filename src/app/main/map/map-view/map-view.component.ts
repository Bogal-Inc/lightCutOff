import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  marklatitude = 3.8381993;
  marklongitude = 11.4907126;
  latitude = 7.369722;
  longitude = 12.354722;

  constructor() { }

  ngOnInit(): void {
  }

}
