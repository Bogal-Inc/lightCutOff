import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRecovredFormComponent } from './report-recovred-form.component';

describe('ReportRecovredFormComponent', () => {
  let component: ReportRecovredFormComponent;
  let fixture: ComponentFixture<ReportRecovredFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRecovredFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRecovredFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
