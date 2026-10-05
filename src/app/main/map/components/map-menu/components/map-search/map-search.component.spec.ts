import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapSearchComponent } from './map-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('mapSearchComponent', () => {
  let component: MapSearchComponent;
  let fixture: ComponentFixture<MapSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSearchComponent ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
