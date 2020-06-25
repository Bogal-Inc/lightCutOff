import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './loading/loading.component';
import { TimestampPipe } from '../core/pipes/timestamp.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MapLegendComponent } from './map-legend/map-legend.component';

@NgModule({
  declarations: [
    MainFooterComponent,
    MainHeaderComponent,
    MapLegendComponent,
    LoadingComponent,
    TimestampPipe,
  ],
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    MainFooterComponent,
    MainHeaderComponent,
    LoadingComponent,
    MapLegendComponent,

    TimestampPipe,

    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
  ],
})
export class SharedModule { }
