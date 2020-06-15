import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormReportComponent } from './update-form-report.component';

describe('UpdateFormReportComponent', () => {
  let component: UpdateFormReportComponent;
  let fixture: ComponentFixture<UpdateFormReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFormReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFormReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
