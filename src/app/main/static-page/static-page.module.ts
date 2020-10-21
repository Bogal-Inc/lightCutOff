import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPageRoutingModule } from './static-page-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TutoComponent } from './tuto/tuto.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import {MapModule} from '../map/map.module';


@NgModule({
  declarations: [AboutUsComponent, TutoComponent, HomeComponent, FaqComponent],
  imports: [
    CommonModule,
    StaticPageRoutingModule,
    SharedModule,
    MapModule,
  ]
})
export class StaticPageModule { }
