import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportsComponent } from './view-reports.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import {ReportDetailsComponent} from '../components/report-details/report-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AgGridModule} from 'ag-grid-angular';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


describe('ViewReportsComponent', () => {
  let component: ViewReportsComponent;
  let fixture: ComponentFixture<ViewReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot(),
        FontAwesomeModule,
        AgGridModule.withComponents([]),
        NoopAnimationsModule
      ],
      declarations: [
        ViewReportsComponent,
        ReportDetailsComponent,
        TimestampPipe
      ],
      providers: [TimestampPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
