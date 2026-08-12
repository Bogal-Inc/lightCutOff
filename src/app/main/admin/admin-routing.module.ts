import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminReportsComponent } from './reports/admin-reports.component';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
  },
  {
    path: 'reports',
    component: AdminReportsComponent,
    canActivate: [adminGuard],
  },
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
