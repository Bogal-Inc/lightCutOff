import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import { SearchPlaceFormComponent } from './components/search-place-form/search-place-form.component';
import {environment} from '../../../environments/environment';
import {GoogleMapsModule} from '@angular/google-maps';
import {MarkerDetailsComponent} from './components/marker-details/marker-details.component';
import {MarkerCreateReportComponent} from './components/marker-create-report/marker-create-report.component';
import {MarkerRecovredReportComponent} from './components/marker-recovred-report/marker-recovred-report.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TutoModalComponent } from './components/tuto-modal/tuto-modal.component';


@NgModule({
  declarations: [
    MapViewComponent,
    MarkerCreateReportComponent,
    SearchPlaceFormComponent,
    MarkerDetailsComponent,
    MarkerRecovredReportComponent,
    TutoModalComponent,
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
    GoogleMapsAPIWrapper,
    NgbActiveModal
  ],
  entryComponents: [
    MarkerRecovredReportComponent,
  ]
})
export class MapModule { }
