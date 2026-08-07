import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChartBarYearlyReportComponent } from './chart-bar-yearly-report.component';
import {TranslateModule} from '@ngx-translate/core';
import {ChartComponent} from '../chart/chart.component';

describe('ChartBarYearlyReport', () => {
  let component: ChartBarYearlyReportComponent;
  let fixture: ComponentFixture<ChartBarYearlyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
              ],
      declarations: [ ChartBarYearlyReportComponent, ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarYearlyReportComponent);
    component = fixture.componentInstance;
    component.chartSettings = {
      barChartData: [],
      barChartType: 'bar',
      barChartOptions: {},
    };
    component.reportsCurrentYear = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
