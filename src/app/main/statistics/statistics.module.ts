import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './components/card/card.component';
import {ChartModule} from 'angular2-chartjs';
import {DashboardChartComponent} from './components/dashboard-chart/dashboard-chart.component';
import {ReportModule} from '../report/report.module';
import {ChartDailyReportComponent} from './components/chart-daily-report/chart-daily-report.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    DashboardChartComponent,
    ChartDailyReportComponent,
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule,
    ChartModule,
    ReportModule
  ]
})
export class StatisticsModule { }
