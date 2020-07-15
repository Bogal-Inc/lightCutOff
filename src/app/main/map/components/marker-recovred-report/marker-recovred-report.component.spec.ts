import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerRecovredReportComponent } from './marker-recovred-report.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

describe('MarkerRecovredReportComponent', () => {
  let component: MarkerRecovredReportComponent;
  let fixture: ComponentFixture<MarkerRecovredReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerRecovredReportComponent ],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
