import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageMaintenanceComponent } from './page-maintenance/page-maintenance.component';
import {MaintenanceRoutingModule} from './maintenance-routing.module';



@NgModule({
  declarations: [PageMaintenanceComponent],
  imports: [
    CommonModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
