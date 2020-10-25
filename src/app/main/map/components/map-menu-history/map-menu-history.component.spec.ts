import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMenuHistoryComponent } from './map-menu-history.component';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

describe('MapMenuHistoryComponent', () => {
  let component: MapMenuHistoryComponent;
  let fixture: ComponentFixture<MapMenuHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      declarations: [ MapMenuHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMenuHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
