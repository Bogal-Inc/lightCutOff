import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, MarkerOptions, LatLngLiteral } from '@agm/core';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  currentPosition: MarkerOptions;
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
    this.initMap();
  }

  private initMap() {
    this.mapsApiLoader.load().then(() => {
      navigator.geolocation.getCurrentPosition( position => {
        const lng = +position.coords.longitude;
        const lat = +position.coords.latitude;

        this.map = {
          latitude: lat,
          longitude: lng,
          zoom: 13,
          streetViewControl: false
        };

        this.currentPosition = this.initCurrentMarker({lat, lng});
      });
    });
  }

  selectMarker(event) {
    console.log("hello world")
  }

  currentMarker(coords: LatLngLiteral)  {
    this.currentPosition = this.initCurrentMarker(coords);
  }

  private initCurrentMarker(coords: LatLngLiteral): MarkerOptions {
    return {
      position: coords,
      opacity: 1,
      clickable: true,
      draggable: true,
      title: 'Votre position'
    };
  }
}
