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
  // Section admin NEUVE (lot 2d v1, 2026-08-11) : /admin/login (Google) +
  // /admin/reports (modération), gardée par adminGuard (users/{uid}.role == 'admin').
  // Les VIEILLES pages 2022 (statistics.module, report.module) restent débranchées —
  // à reconstruire ou supprimer, ne pas les rebrancher sans garde.
  {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: () =>
      import('./main/admin/admin.module').then(
        m => m.AdminModule
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
