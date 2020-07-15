import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListComponent } from './report-list.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import {ReportDetailsComponent} from '../components/report-details/report-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AgGridModule} from 'ag-grid-angular';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';


describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot(),
        FontAwesomeModule,
        AgGridModule.withComponents([]),
        NoopAnimationsModule,
        RouterModule.forRoot([]),
      ],
      declarations: [
        ReportListComponent,
        ReportDetailsComponent,
        TimestampPipe
      ],
      providers: [
        TimestampPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
