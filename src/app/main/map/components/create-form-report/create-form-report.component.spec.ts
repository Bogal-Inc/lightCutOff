import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CreateFormReportComponent } from './create-form-report.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

describe('CreateFormReportComponent', () => {
  let component: CreateFormReportComponent;
  let fixture: ComponentFixture<CreateFormReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFormReportComponent ],
      imports: [
        FormsModule,
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
    fixture = TestBed.createComponent(CreateFormReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
