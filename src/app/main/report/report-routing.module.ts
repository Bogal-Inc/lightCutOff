import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewReportsComponent} from './view-reports/view-reports.component';


const routes: Routes = [
  {
    path: 'reports',
    component: ViewReportsComponent,
  },
  {
    path: 'report/:id',
    component: ViewReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
