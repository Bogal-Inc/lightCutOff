import { TestBed } from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MapService} from '@Services/map.service';
import {locations} from '../../shared/mocks/locations.mock';

declare var google: any;

describe('MapService', () => {
  let service: MapService;
  let locationsMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ]
    });
    service = TestBed.inject(MapService);
    service.map = spyOn(google.maps, 'Map');
    service.position = {
      lat: 11.48022226405379,
      lng: 3.843249609352396
    };
    locationsMock = locations;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#markerUserOption should marker option', () => {
    const markerOption = service.markerUserOption();
    expect(markerOption.position).toEqual(service.position);
    expect(markerOption.label).toEqual('main.map-view.your_position');
    expect(markerOption.icon.url).toEqual('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    expect(markerOption.draggable).toBeTrue();
  });

  it('#getAddresses should return address', () => {
    const locality = ['Douala', 'Cameroun'];
    const addresse = service.getAddresses(locationsMock, locality);

    expect(addresse.country).toEqual(locality[1]);
    expect(addresse.department).toEqual(null);
    expect(addresse.city).toEqual(locality[0]);
    expect(addresse.neighborhood).toEqual('Unnamed Road');
  });

  it('#getCountryCity should return country', () => {
    const countryCity = service.getCountryCity(locationsMock[0]);

    expect(countryCity[0]).toEqual('Douala');
    expect(countryCity[1]).toEqual('Cameroun');
  });
});
