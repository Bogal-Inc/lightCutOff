import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import {AngularFireAnalyticsModule} from '@angular/fire/compat/analytics';
import {ReactiveFormsModule} from '@angular/forms';
import { GeolocationComponent } from './modals/geolocation/geolocation.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    EmptyLayoutComponent,
    GeolocationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
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
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr' },
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
