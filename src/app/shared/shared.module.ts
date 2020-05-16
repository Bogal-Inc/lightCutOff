import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgmCoreModule
  ],
  exports: [
    AgmCoreModule
  ]
})
export class SharedModule { }
