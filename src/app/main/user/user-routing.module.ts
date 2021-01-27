import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnReportComponent} from './own-report/own-report.component';
import {RegisterComponent} from './register/register.component';
import {SigninComponent} from './signin/signin.component';
import {AuthGuard} from '../../core/guards/auth.guard';


const routes: Routes = [
  {
    path: 'own-report',
    component: OwnReportComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
