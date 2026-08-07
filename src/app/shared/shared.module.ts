import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { TimestampPipe } from '@Pipes/timestamp.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GlobalMessageComponent } from './global-message/global-message.component';


@NgModule({
  declarations: [
    MainFooterComponent,
    MainHeaderComponent,
    LoadingComponent,
    TimestampPipe,
    AdminNavComponent,
    ContactUsComponent,
    DownloadAppComponent,
    GlobalMessageComponent,
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
    NgbModule,
    MainFooterComponent,
    MainHeaderComponent,
    LoadingComponent,
    TimestampPipe,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    TranslateModule,
    FontAwesomeModule,
    AdminNavComponent,
    ContactUsComponent,
    GlobalMessageComponent
  ],
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'}
  ]
})
export class SharedModule { }
