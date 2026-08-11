import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { ReportDatatableComponent } from './components/report-datatable/report-datatable.component';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { ReportRoutingModule } from './report-routing.module';
import {ReportDetailsComponent} from './components/report-details/report-details.component';
import {ReportDetailsMobileComponent} from './report-details-mobile/report-details-mobile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {ReportListComponent} from './report-list/report-list.component';

// ag-grid v34 : enregistrement au chargement du module lazy (PAS dans main.ts,
// sinon ~1 Mo de grille embarqué dans le bundle initial du site public).
// ⚠️ Le thème CSS (ag-grid.css + ag-theme-alpine.css) a été retiré des styles globaux
// d'angular.json en même temps — à recâbler (bundle lazy ou refonte) au lot 2d.
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: 'legacy' });

@NgModule({
  declarations: [
    ReportDetailsMobileComponent,
    ReportDetailsComponent,
    ReportListComponent,
    ReportDatatableComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    AgGridModule,
  ],
  exports: [
    ReportDatatableComponent
  ],
  providers: [TimestampPipe]
})
export class ReportModule { }
