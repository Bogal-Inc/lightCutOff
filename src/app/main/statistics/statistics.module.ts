import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './components/card/card.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReportDatatableComponent } from './components/report-datatable/report-datatable.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    ReportDatatableComponent,
    ViewReportsComponent,
    ReportDetailsComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule,
    FormsModule,
    AgGridModule.withComponents([]),
    ChartsModule
  ],
  providers: [ TimestampPipe ]
})
export class StatisticsModule { }
