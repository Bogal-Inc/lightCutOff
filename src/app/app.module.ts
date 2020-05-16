import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { AgmCoreModule } from '@agm/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAgKrc6r4KHEcuiJ11qY2_H2ID2dD6n1cI'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
