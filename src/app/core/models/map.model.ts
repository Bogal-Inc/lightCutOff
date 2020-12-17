import {Location, Position} from '@Models/report.model';
import {Const} from '../../../environments/const';

declare const MarkerClusterer: any;

const ZOOM = 14;
const BG_COLOR = '#eaeaea';

export class MapModel {
  // tslint:disable-next-line:variable-name
  private _map;
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
   * @description get address from address elements from google api
   * @param googleLocations element address from google api
   * @param location country from google api
   */
  getAddresses(googleLocations, location): Location {
    // delete last element for array
    googleLocations.pop();

    let locationTmp = {
      country: location[1],
      region: null,
      department: null,
      city: location[0],
      neighborhood: null,
      addresses: [],
      others: [],
      googleData: [],
    };
    googleLocations.forEach(
      locate => {
        locationTmp = this.intiLocation(locate, locationTmp);
      }
    );

    if (locationTmp.country && locationTmp.city) {
      return null;
    }
    return locationTmp;
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

  private intiLocation(locate, locationTmp) {
    let locateType = locate.types[0];

    if (locateType === 'political') {
      locateType = locate.types[1];
    }

    const label = locate.formatted_address;
    const address = {
      label,
      type: locate.types
    };

    if (locateType === 'administrative_area_level_1') {
      locationTmp.region = this.getRegion(label);
    } else if (locateType === 'administrative_area_level_2') {
      locationTmp.department = this.getDataLocation(label);
    } else if (locateType === 'sublocality') {
      locationTmp.neighborhood = label.split(', ')[0];
    } else if (locateType === 'neighborhood') {
      locationTmp.neighborhood = label.split(', ')[0];
    } else if (locateType === 'street_address') {
      locationTmp.addresses.push(address);
    } else if (locateType === 'route') {
      locationTmp.addresses.push(address);
      if (locationTmp.neighborhood === null) {
        locationTmp.neighborhood = label.split(', ')[0];
      }
    } else {
      locationTmp.others.push(address);
      if (locationTmp.neighborhood === null) {
        locationTmp.neighborhood = label.split(', ')[0];
      }
    }

    locationTmp.googleData.push(address);

    return locationTmp;
  }

  private getRegion(regionBrut) {
    let region = regionBrut.split(', ')[0];
    region = region.split(' ')[2];

    if (region.indexOf('\'') > 0) {
      region = region.split('\'')[1];
    }

    if (region === 'Ctre') {
      return 'Centre';
    }

    return region;
  }

  private getDataLocation(dataLocation) {
    const resultCountry = dataLocation.split(', ');
    return resultCountry[resultCountry.length - 2];
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
