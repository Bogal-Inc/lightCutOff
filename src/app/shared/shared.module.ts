import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './loading/loading.component';
import { TimestampPipe } from '../core/pipes/timestamp.pipe';


@NgModule({
  declarations: [
    MainFooterComponent,
    MainHeaderComponent,
    LoadingComponent,
    TimestampPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    MainFooterComponent,
    MainHeaderComponent,
    LoadingComponent,

    TimestampPipe,

    ReactiveFormsModule,
    NgbModule
  ]
})
export class SharedModule { }
