import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnReportComponent } from './own-report.component';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('OwnReportComponent', () => {
  let component: OwnReportComponent;
  let fixture: ComponentFixture<OwnReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ OwnReportComponent ],
      providers: [
        TimestampPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
