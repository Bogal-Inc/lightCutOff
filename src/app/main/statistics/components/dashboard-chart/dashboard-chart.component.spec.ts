import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartComponent } from './dashboard-chart.component';
import {TranslateModule} from '@ngx-translate/core';
import {ChartModule} from 'angular2-chartjs';

describe('DashboardChart', () => {
  let component: DashboardChartComponent;
  let fixture: ComponentFixture<DashboardChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ChartModule
      ],
      declarations: [ DashboardChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartComponent);
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
