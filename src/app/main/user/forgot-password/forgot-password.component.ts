import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services-firebase';
import {Logger} from '@Services/logger.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';


const log = new Logger('forgotPassword.component');

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  onSubmit(event) {
    // tslint:disable-next-line:no-unused-expression
    event.preventDefault;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email').value;

    this.authService.sendPasswordResetEmail(email).then(() => {
      log.debug('Send password reset mail');
      this.toastrService.success(this.translateService.instant('user.forgot-password.success_message'));
    }).catch((error) => {
      log.error(error);
      this.toastrService.error(this.translateService.instant('user.forgot-password.err_message'));
    });
  }
}
