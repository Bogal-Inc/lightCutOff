import { MainFooterComponent } from './../../../shared/main-footer/main-footer.component';
import { UpdateFormReportComponent } from './../components/update-form-report/update-form-report.component';
import { CreateFormReportComponent } from './../components/create-form-report/create-form-report.component';
import { MapLegendComponent } from './../components/map-legend/map-legend.component';
import { LoadingComponent } from './../../../shared/loading/loading.component';
import { SearchPlaceFormComponent } from './../components/search-place-form/search-place-form.component';
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

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapViewComponent,
        SearchPlaceFormComponent,
        LoadingComponent,
        MapLegendComponent,
        CreateFormReportComponent,
        UpdateFormReportComponent,
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
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapsApiKey,
          region: 'CM',
          language: 'fr',
          libraries: ['places']
        }),
      ],
      providers: [
        // use french locale
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
