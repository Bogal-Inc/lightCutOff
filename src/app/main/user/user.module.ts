import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { OwnReportComponent } from './own-report/own-report.component';
import {ReportRoutingModule} from '../report/report-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import {MapModule} from '../map/map.module';
import { OwnReportDetailComponent } from './components/own-report-detail/own-report-detail.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';


@NgModule({
  declarations: [
    OwnReportComponent,
    OwnReportDetailComponent,
    SignupComponent,
    SigninComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    SignupFormComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReportRoutingModule,
        SharedModule,
        AgGridModule,
        MapModule,
    ],
  providers: [TimestampPipe]
})
export class UserModule { }
