import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { ReportDatatableComponent } from './components/report-datatable/report-datatable.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReportRoutingModule } from './report-routing.module';
import {ReportDetailsComponent} from './components/report-details/report-details.component';
import {ReportDetailsMobileComponent} from './report-details-mobile/report-details-mobile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {ReportListComponent} from './report-list/report-list.component';


@NgModule({
  declarations: [
    ReportDetailsMobileComponent,
    ReportDetailsComponent,
    ReportListComponent,
    ReportDatatableComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    AgGridModule,
  ],
  exports: [
    ReportDatatableComponent
  ],
  providers: [TimestampPipe]
})
export class ReportModule { }
