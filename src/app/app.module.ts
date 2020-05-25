import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment.dist';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    StoreModule.forRoot({}, {}),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),
    NgbModule,
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
