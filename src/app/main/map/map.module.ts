import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import { CreateFormReportComponent } from './components/create-form-report/create-form-report.component';
import { SearchPlaceFormComponent } from './components/search-place-form/search-place-form.component';
import { UpdateFormReportComponent } from './components/update-form-report/update-form-report.component';
import {environment} from '../../../environments/environment';
import {GoogleMapsModule} from '@angular/google-maps';
import {MarkerDetailsComponent} from './components/marker-details/marker-details.component';


@NgModule({
  declarations: [
    MapViewComponent,
    CreateFormReportComponent,
    SearchPlaceFormComponent,
    UpdateFormReportComponent,
    MarkerDetailsComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
    AgmCoreModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      region: 'CM',
      language: 'fr',
      libraries: ['places']
    }),
    GoogleMapsModule,
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  entryComponents: [ UpdateFormReportComponent ]
})
export class MapModule { }
