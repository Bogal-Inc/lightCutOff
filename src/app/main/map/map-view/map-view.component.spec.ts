import { LoadingComponent } from '../../../shared/loading/loading.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewComponent } from './map-view.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MapLegendComponent } from 'src/app/shared/map-legend/map-legend.component';
import { NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {MapSearchComponent} from '../components/map-search/map-search.component';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapViewComponent,
        MapSearchComponent,
        LoadingComponent,
        MapLegendComponent,
        NgbTooltip
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
        TranslateModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapsApiKey,
          region: 'CM',
          language: 'fr',
          libraries: ['places']
        }),
      ],
      providers: [
        NgbTooltipConfig,
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
