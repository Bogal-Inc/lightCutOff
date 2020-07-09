import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './components/card/card.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReportDatatableComponent } from './components/report-datatable/report-datatable.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';


@NgModule({
  declarations: [DashboardComponent, CardComponent, ReportDatatableComponent, ViewReportsComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    FormsModule,
    AgGridModule.withComponents([])
  ]
})
export class ReportModule { }
