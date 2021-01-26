import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MustMatch} from '@Helpers/must-match.validator';
import {AuthService} from '../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';

const log = new Logger('signup.component');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  cguError = false;

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
      confirmPassword: ['', Validators.required],
      accept: [false]
    }, { validator: MustMatch('password', 'confirmPassword')});
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
    const accept = this.form.get('accept').value;

    if (!accept) {
      this.cguError = true;
      return;
    }

    this.authService.createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.sendEmailVerification().then(() => {
          this.toastrService.success(
            this.translateService.instant('user.register.save_success_message'),
            this.translateService.instant('user.register.save_success_title')
          );
        }).catch((error) => {
          log.debug(error);
          this.toastrService.error(this.translateService.instant('user.register.save_error'));
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        log.debug(errorCode, errorMessage);
        this.toastrService.error(this.translateService.instant('user.register.save_error'));
      });
  }
}
