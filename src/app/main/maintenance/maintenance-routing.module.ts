import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageMaintenanceComponent} from './page-maintenance/page-maintenance.component';


const routes: Routes = [
  {
    path: '',
    component: PageMaintenanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
