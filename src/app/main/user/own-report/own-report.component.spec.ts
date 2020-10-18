import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReportComponent } from './own-report.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('OwnReportComponent', () => {
  let component: OwnReportComponent;
  let fixture: ComponentFixture<OwnReportComponent>;

  beforeEach(async(() => {
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
