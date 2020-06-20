import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { CreateFormReportComponent } from './components/create-form-report/create-form-report.component';
import { SearchPlaceFormComponent } from './components/search-place-form/search-place-form.component';
import { MapLegendComponent } from './components/map-legend/map-legend.component';
import { UpdateFormReportComponent } from './components/update-form-report/update-form-report.component';


@NgModule({
  declarations: [
    MapViewComponent,
    CreateFormReportComponent,
    SearchPlaceFormComponent,
    MapLegendComponent,
    UpdateFormReportComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
    AgmCoreModule,
  ],
  entryComponents: [ UpdateFormReportComponent ]
})
export class MapModule { }
