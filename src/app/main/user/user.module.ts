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
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';


@NgModule({
  declarations: [
    OwnReportComponent,
    OwnReportDetailComponent,
    RegisterComponent,
    SigninComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    RegisterFormComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReportRoutingModule,
        SharedModule,
        AgGridModule.withComponents([]),
        MapModule,
    ],
  providers: [TimestampPipe]
})
export class UserModule { }
