import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {Const} from '../../../environments/const';
import {GoogleInfosLoaction, Location, Position} from '@Models/report.model';
import {TranslateService} from '@ngx-translate/core';
import {MarkerRecovredReportComponent} from '../../main/map/components/marker-recovred-report/marker-recovred-report.component';
import {Cameroon} from '../../../environments/countries/cameroon';

declare const MarkerClusterer: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // tslint:disable-next-line:variable-name
  private _map;
  // tslint:disable-next-line:variable-name
  private _position: Position;

  constructor(
    private translateService: TranslateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    ) {
  }

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

  initMap(gmap, legends, btnAddReport) {
    const mapOptions = {
      center: this._position,
      zoom: 12,
      restriction: {
        latLngBounds: Const.coordsCameroon,
      },
      disableDoubleClickZoom: true,
      backgroundColor: '#eaeaea',
      mapTypeControl: false,
      streetViewControl: false
    };

    this._map = new google.maps.Map(gmap, mapOptions);
    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legends);
    this._map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(btnAddReport);

    return this._map;
  }

  /**
   * format address from google map API
   *
   */
  getAddresses(googleLocations, location): Location {
    // delete last element for array
    googleLocations.pop();

    const googleInfos = googleLocations.map(
      (data) => {
        return {
            label: data.formatted_address,
            types: data.types
        };
      }
    );

    return {
      country: location[1],
      region: location[0],
      department: '',
      city: '',
      district: '',
      googleInfos
    };
  }

  private getRegion(regionBrut: string) {
    Cameroon.regions.forEach(
      region => {
        return (regionBrut.indexOf(region)) ? region : null;
      }
    );
  }

  private getDepartment(departmentBrut: string) {
    Cameroon.regions.forEach(
      region => {
        return (departmentBrut.indexOf(region)) ? region : null;
      }
    );
  }

  /**
   * return country and city
   *
   */
  getLocality(address): string[] {
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

  markerUserOption() {
    return {
      position: this._position,
      label: this.translateService.instant('main.map-view.your_position'),
      icon: {
        url: Const.markerColor.user
      },
      draggable: true,
      zIndex: 2000
    };
  }

  createComponent(data, component, container: ViewContainerRef): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(componentFactory);

    (componentRef.instance as MarkerRecovredReportComponent).data = data;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }
}
