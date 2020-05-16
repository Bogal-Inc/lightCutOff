import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';


@NgModule({
  declarations: [
    MapViewComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
