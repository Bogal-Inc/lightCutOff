import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnReportComponent} from './own-report/own-report.component';
import {RegisterComponent} from './register/register.component';


const routes: Routes = [
  {
    path: 'own-report',
    component: OwnReportComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
