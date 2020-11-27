import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {EmptyLayoutComponent} from './layouts/empty-layout/empty-layout.component';
import {NotFoundComponent} from './main/static-page/not-found/not-found.component';


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
      import('./main/static-page/static-page.module').then(
        m => m.StaticPageModule
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
    path: 'page-not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: () =>
      import('./main/statistics/statistics.module').then(
        m => m.StatisticsModule
      ),
  },
  {
    path: 'admin',
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
