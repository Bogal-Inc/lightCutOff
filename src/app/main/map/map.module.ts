import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import {MarkerDetailsComponent} from './components/marker-details/marker-details.component';
import {MarkerCreateReportComponent} from './components/marker-create-report/marker-create-report.component';
import {MarkerRecovredReportComponent} from './components/marker-recovred-report/marker-recovred-report.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { MapFilterComponent } from './components/map-menu/components/map-filter/map-filter.component';
import {MapSearchComponent} from './components/map-menu/components/map-search/map-search.component';
import {MapTutoModalComponent} from './components/map-tuto-modal/map-tuto-modal.component';
import { MapMenuStatsComponent } from './components/map-menu/components/map-menu-stats/map-menu-stats.component';
import {MapLegendComponent} from './components/map-legend/map-legend.component';
import {MapMenuComponent} from './components/map-menu/map-menu.component';
import { MapMenuHistoryComponent } from './components/map-menu/components/map-menu-history/map-menu-history.component';
import { MapNotFoundComponent } from './components/map-not-found/map-not-found.component';


@NgModule({
  declarations: [
    MapViewComponent,
    MarkerCreateReportComponent,
    MarkerDetailsComponent,
    MarkerRecovredReportComponent,
    MapTutoModalComponent,
    MapFilterComponent,
    MapSearchComponent,
    MapMenuComponent,
    MapMenuStatsComponent,
    MapLegendComponent,
    MapMenuHistoryComponent,
    MapNotFoundComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule
  ],
  providers: [
    NgbActiveModal
  ],
  exports: [
    MapLegendComponent
  ]
})
export class MapModule { }
