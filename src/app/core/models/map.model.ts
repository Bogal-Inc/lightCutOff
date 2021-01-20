import {Position} from '@Models/report.model';
import {Const} from '../../../environments/const';

declare const MarkerClusterer: any;

const ZOOM = 14;
const BG_COLOR = '#eaeaea';

export class MapModel {
  // tslint:disable-next-line:variable-name
  private _map;
  // position user on map
  // tslint:disable-next-line:variable-name
  private _position: Position;

  get map(){
    return this._map;
  }

  set map(map){
    this._map = map;
  }

  get position(){
    return this._position;
  }

  set position(position: Position){
    this._position = position;
  }

  public constructor(position, gmap, components) {
    this._position = position;
    this.initMap(gmap, components);
  }

  markerUserOption(label) {
    return {
      position: this._position,
      label,
      icon: {
        url: Const.markerColor.user
      },
      draggable: true,
      zIndex: 2000
    };
  }

  /**
   * @description get country from address element
   * @param address contain element address from google
   */
  getCountryCity(address): string[] {
    const resultCountry = address.formatted_address.split(', ');
    const country = resultCountry[resultCountry.length - 1];
    const city = resultCountry[resultCountry.length - 2];
    return [city, country];
  }

  addMarkersToCluster(markers: google.maps.Marker[]) {
    return new MarkerClusterer(
      this._map,
      markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
    );
  }

  private initMap(gmap, components) {
    const mapOptions = {
      center: this._position,
      zoom: ZOOM,
      restriction: {
        latLngBounds: Const.coordsCameroon,
      },
      disableDoubleClickZoom: true,
      backgroundColor: BG_COLOR,
      mapTypeControl: false,
      streetViewControl: false
    };

    this._map = new google.maps.Map(gmap, mapOptions);
    this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(components[0]);
    this._map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(components[1]);
    this._map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(components[2]);
  }
}
