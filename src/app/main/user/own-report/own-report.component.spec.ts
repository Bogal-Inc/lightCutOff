import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReportComponent } from './own-report.component';

describe('OwnReportComponent', () => {
  let component: OwnReportComponent;
  let fixture: ComponentFixture<OwnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
