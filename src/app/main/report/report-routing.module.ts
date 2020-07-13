import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportDetailsMobileComponent} from './report-details-mobile/report-details-mobile.component';
import {ReportListComponent} from './report-list/report-list.component';


const routes: Routes = [
  {
    path: 'reports',
    component: ReportListComponent,
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
