import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnReportComponent} from './own-report/own-report.component';


const routes: Routes = [
  {
    path: 'own-report',
    component: OwnReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
