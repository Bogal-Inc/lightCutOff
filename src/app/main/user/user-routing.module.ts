import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnReportComponent} from './own-report/own-report.component';
import {SignupComponent} from './signup/signup.component';
import {SigninComponent} from './signin/signin.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ModuleUserGuard} from '../../core/guards/module-user.guard';


const routes: Routes = [
  {
    path: 'own-report',
    component: OwnReportComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [ModuleUserGuard]
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthGuard, ModuleUserGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [ModuleUserGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ModuleUserGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
