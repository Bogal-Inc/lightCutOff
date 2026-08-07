import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import {AngularFireAnalyticsModule} from '@angular/fire/compat/analytics';
import {ReactiveFormsModule} from '@angular/forms';
import { MessagingComponent } from './modals/messaging/messaging.component';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import {MessagingService} from './core/services-firebase';
import {AsyncPipe} from '@angular/common';
import { TutorialComponent } from './modals/tutorial/tutorial.component';
import { GeolocationComponent } from './modals/geolocation/geolocation.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    EmptyLayoutComponent,
    MessagingComponent,
    TutorialComponent,
    GeolocationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireAnalyticsModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      progressBar: true
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // NgcCookieConsentModule.forRoot(cookieConfig),
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr' },
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    MessagingService,
    AsyncPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
