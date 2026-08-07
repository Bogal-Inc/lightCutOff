import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './components/card/card.component';
import {ChartComponent} from './components/chart/chart.component';
import {ReportModule} from '../report/report.module';
import {ChartBarYearlyReportComponent} from './components/chart-bar-yearly-report/chart-bar-yearly-report.component';
import {ChartLineDailyReportComponent} from './components/chart-line-daily-report/chart-line-daily-report.component';
import { StatisticsNumberComponent } from './statistics-number/statistics-number.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    ChartBarYearlyReportComponent,
    ChartLineDailyReportComponent,
    StatisticsNumberComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule,
    ReportModule
  ]
})
export class StatisticsModule { }
