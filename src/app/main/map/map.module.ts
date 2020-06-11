import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { ReportRecovredFormComponent } from './components/report-recovred-form/report-recovred-form.component';
import { FormsModule } from '@angular/forms';
import { SearchPlaceFormComponent } from './components/search-place-form/search-place-form.component';
import { MapLegendComponent } from './components/map-legend/map-legend.component';


@NgModule({
  declarations: [
    MapViewComponent,
    ReportRecovredFormComponent,
    SearchPlaceFormComponent,
    MapLegendComponent,
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
