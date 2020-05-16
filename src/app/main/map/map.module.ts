import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { SelectCurrentMarkerComponent } from './components/select-current-marker/select-current-marker.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MapViewComponent,
    SelectCurrentMarkerComponent
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
