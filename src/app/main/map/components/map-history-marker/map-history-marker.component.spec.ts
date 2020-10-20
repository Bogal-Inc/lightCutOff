import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHistoryMarkerComponent } from './map-history-marker.component';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

describe('MapHistoryMarkerComponent', () => {
  let component: MapHistoryMarkerComponent;
  let fixture: ComponentFixture<MapHistoryMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      declarations: [ MapHistoryMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHistoryMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
