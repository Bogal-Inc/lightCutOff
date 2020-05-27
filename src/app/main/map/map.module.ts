import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { ReportRecovredFormComponent } from './components/report-recovred-form/report-recovred-form.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MapViewComponent,
    ReportRecovredFormComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
    AgmCoreModule,
    FormsModule
  ]
})
export class MapModule { }
