import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReportListComponent } from './report-list/report-list.component';


@NgModule({
  declarations: [ReportListComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ReportModule { }
