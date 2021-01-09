import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNotFoundComponent } from './map-not-found.component';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';

describe('MapNotFoundComponent', () => {
  let component: MapNotFoundComponent;
  let fixture: ComponentFixture<MapNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ MapNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
