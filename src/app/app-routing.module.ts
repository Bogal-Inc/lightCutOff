import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {EmptyLayoutComponent} from './layouts/empty-layout/empty-layout.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: EmptyLayoutComponent,
  //   loadChildren: () =>
  //     import('./main/maintenance/maintenance.module').then(
  //       m => m.MaintenanceModule
  //     ),
  // },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./main/general/general.module').then(
        m => m.GeneralModule
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./main/map/map.module').then(
        m => m.MapModule
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./main/user/user.module').then(
        m => m.UserModule
      ),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    loadChildren: () =>
      import('./main/statistics/statistics.module').then(
        m => m.StatisticsModule
      ),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    loadChildren: () =>
      import('./main/report/report.module').then(
        m => m.ReportModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
