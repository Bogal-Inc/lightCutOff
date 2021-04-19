import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnReportDetailComponent } from './own-report-detail.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr';
import {OWL_DATE_TIME_LOCALE} from 'ng-pick-datetime';

describe('OwnReportDetailComponent', () => {
  let component: OwnReportDetailComponent;
  let fixture: ComponentFixture<OwnReportDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
      ],
      declarations: [ OwnReportDetailComponent ],
      providers: [
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
