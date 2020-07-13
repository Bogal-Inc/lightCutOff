import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportDetailsComponent } from './report-details.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('ReportDetailsComponent', () => {
  let component: ReportDetailsComponent;
  let fixture: ComponentFixture<ReportDetailsComponent>;
  let timeStamp: TimestampPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      declarations: [
        ReportDetailsComponent,
        TimestampPipe
      ],
      providers: [ TimestampPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    timeStamp = new TimestampPipe('fr');
    fixture = TestBed.createComponent(ReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
