import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminReportsComponent } from './reports/admin-reports.component';
import { AdminStatsComponent } from './stats/admin-stats.component';

/**
 * Lot 2d v1 — section admin NEUVE (schéma Njuka) : /admin/login (Google) +
 * /admin/reports (modération). Les pages 2022 (dashboard, ag-grid…) restent
 * débranchées. Volontairement sans ag-grid : table Bootstrap simple.
 */
@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminReportsComponent,
    AdminStatsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
  ],
})
export class AdminModule { }
