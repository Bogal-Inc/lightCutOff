import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDailyReportComponent } from './chart-daily-report.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('ChartDailyReportComponent', () => {
  let component: ChartDailyReportComponent;
  let fixture: ComponentFixture<ChartDailyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ ChartDailyReportComponent ],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDailyReportComponent);
    component = fixture.componentInstance;
    component.reportsCurrentMonth = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
