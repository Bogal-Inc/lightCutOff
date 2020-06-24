import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInfosComponent } from './report-infos.component';

describe('ReportInfosComponent', () => {
  let component: ReportInfosComponent;
  let fixture: ComponentFixture<ReportInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
