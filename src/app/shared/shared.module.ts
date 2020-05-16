import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';


@NgModule({
  declarations: [
    MainFooterComponent,
    MainHeaderComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MainFooterComponent,
    MainHeaderComponent
  ]
})
export class SharedModule { }
