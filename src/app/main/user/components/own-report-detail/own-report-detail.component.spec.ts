import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReportDetailComponent } from './own-report-detail.component';

describe('OwnReportDetailComponent', () => {
  let component: OwnReportDetailComponent;
  let fixture: ComponentFixture<OwnReportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnReportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
