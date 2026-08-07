import { LoadingComponent } from '../../../shared/loading/loading.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapViewComponent } from './map-view.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { MapLegendComponent } from 'src/app/main/map/components/map-legend/map-legend.component';
import { NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MapSearchComponent} from '../components/map-menu/components/map-search/map-search.component';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapViewComponent,
        MapSearchComponent,
        LoadingComponent,
        MapLegendComponent
      ],
      imports: [
        NgbTooltip,
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
              ],
      providers: [
        NgbTooltipConfig,
        TranslateService,
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
