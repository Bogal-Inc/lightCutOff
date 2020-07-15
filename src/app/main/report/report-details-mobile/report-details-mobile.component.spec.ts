import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsMobileComponent } from './report-details-mobile.component';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {timestamp} from 'rxjs/operators';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('ReportDetailsMobileComponent', () => {
  let component: ReportDetailsMobileComponent;
  let fixture: ComponentFixture<ReportDetailsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
      declarations: [
        ReportDetailsMobileComponent,
        TimestampPipe
      ],
      providers: [TimestampPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
