import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsMobileComponent } from './report-details-mobile.component';

describe('ReportDetailsMobileComponent', () => {
  let component: ReportDetailsMobileComponent;
  let fixture: ComponentFixture<ReportDetailsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDetailsMobileComponent ]
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
