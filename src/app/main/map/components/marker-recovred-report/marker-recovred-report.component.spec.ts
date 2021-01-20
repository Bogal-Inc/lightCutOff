import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkerRecovredReportComponent} from './marker-recovred-report.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from 'src/environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {ToastrModule} from 'ngx-toastr';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ReportSatus} from '@Models/report.model';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('MarkerRecovredReportComponent', () => {
  let component: MarkerRecovredReportComponent;
  let fixture: ComponentFixture<MarkerRecovredReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarkerRecovredReportComponent,
        TimestampPipe
      ],
      imports: [
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
      ],
      providers: [
        // use french locale
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerRecovredReportComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component.data = {
      report: {
        id: 'Vi99X162RrJSoa6yZWQy',
        location: null,
        position: {lng: 10.128435727697527, lat: 3.7867701003760614},
        recovredAt: null,
        reportedAt: {seconds: 1603022468, nanoseconds: 228000000},
        status: ReportSatus.CUT_COMPLETED,
        _createdAt: {seconds: 1603022488, nanoseconds: 184000000},
        _createdBy: {id: '6wXgCDpPQjbM73lf339BLh5uQK22'},
        _deletedAt: null,
        _deletedBy: {id: null},
        _isDelete: false,
        _updatedAt: {seconds: 1603022488, nanoseconds: 599000000},
        _updatedBy: {id: '6wXgCDpPQjbM73lf339BLh5uQK22'}
      },
      markerCurrentInfoWindow: null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
