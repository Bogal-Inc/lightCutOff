import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormReportComponent } from './create-form-report.component';

describe('ReportRecovredFormComponent', () => {
  let component: CreateFormReportComponent;
  let fixture: ComponentFixture<CreateFormReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFormReportComponent ]
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
