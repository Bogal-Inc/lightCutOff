import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDatatableComponent } from './report-datatable.component';

describe('ReportDatatableComponent', () => {
  let component: ReportDatatableComponent;
  let fixture: ComponentFixture<ReportDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
