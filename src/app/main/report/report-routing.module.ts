import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewReportsComponent} from './view-reports/view-reports.component';
import {ReportDetailsMobileComponent} from './report-details-mobile/report-details-mobile.component';


const routes: Routes = [
  {
    path: 'reports',
    component: ViewReportsComponent,
  },
  {
    path: 'report',
    component: ReportDetailsMobileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
