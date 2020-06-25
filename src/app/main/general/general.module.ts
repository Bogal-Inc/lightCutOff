import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TutoComponent } from './tuto/tuto.component';


@NgModule({
  declarations: [AboutUsComponent, TutoComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    SharedModule,
  ]
})
export class GeneralModule { }
