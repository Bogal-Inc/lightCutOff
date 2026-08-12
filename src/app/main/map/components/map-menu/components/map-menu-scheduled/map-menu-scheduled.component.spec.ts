import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { MapMenuScheduledComponent } from './map-menu-scheduled.component';
import { OfficialOutage } from '@Models/official-outage.model';

describe('MapMenuScheduledComponent', () => {
  let component: MapMenuScheduledComponent;
  let fixture: ComponentFixture<MapMenuScheduledComponent>;

  const outage = (over: Partial<OfficialOutage>): OfficialOutage => ({
    provider: 'eneo', country: 'CM', region: 'Centre', ville: 'Yaoundé', quartier: 'Bastos',
    reason: 'travaux', progDate: '2099-01-02', startTime: '08:00', endTime: '17:00', ...over
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapMenuScheduledComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MapMenuScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filtre par région et par recherche quartier', () => {
    component.outages = [
      outage({}),
      outage({ region: 'Littoral', ville: 'Douala', quartier: 'Akwa' }),
    ];
    component.region = 'Littoral';
    expect(component.filteredOutages.length).toBe(1);
    expect(component.filteredOutages[0].quartier).toBe('Akwa');

    component.region = null;
    component.query = 'bastos';
    expect(component.filteredOutages.length).toBe(1);
    expect(component.filteredOutages[0].quartier).toBe('Bastos');
  });

  it('émet la recherche « quartier, ville » au clic', () => {
    spyOn(component.goToPlace, 'emit');
    component.onSelect(outage({}));
    expect(component.goToPlace.emit).toHaveBeenCalledWith({ query: 'Bastos, Yaoundé' });
  });
});
