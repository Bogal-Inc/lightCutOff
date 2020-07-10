import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsComponent } from './report-details.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('ReportDetailsComponent', () => {
  let component: ReportDetailsComponent;
  let fixture: ComponentFixture<ReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        ReportDetailsComponent,
        TimestampPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
