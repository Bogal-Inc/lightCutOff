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
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    MainFooterComponent,
    MainHeaderComponent,
    MapLegendComponent,
    LoadingComponent,
    TimestampPipe,
    AdminNavComponent,
    ContactUsComponent,
  ],
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
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
        TranslateModule,
        FontAwesomeModule,
        NgbModule,
        AdminNavComponent,
        ContactUsComponent
    ],
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
  ],
})
export class SharedModule { }
