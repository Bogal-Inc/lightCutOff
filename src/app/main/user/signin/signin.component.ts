import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {Router} from '@angular/router';

const log = new Logger('signin.component');

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  reActiveEmail = false;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    this.login(email, password);
  }

  sendEmailVerification() {
    this.user.sendEmailVerification();
    this.reActiveEmail = false;
  }

  private logout() {
    this.authService.logout().then(
      () => {
        log.debug('user logout. Email not verified');

        this.toastrService.error(
          this.translateService.instant('user.signin.email_verified_body'),
          this.translateService.instant('user.signin.email_verified_title')
        );
      },
    )
      .catch(
        (err) => log.error(err)
      );
  }

  private login(email, password) {
    this.authService.login(email, password).then((userCredential) => {
      log.debug('user login');

      this.user = userCredential.user;
      if (!this.user.emailVerified) {
        this.reActiveEmail = true;
        this.logout();
      } else {
        window.localStorage.setItem('LCO_userLogged', JSON.stringify({
          id: this.user.uid,
          photoURL: this.user.photoURL,
          phoneNumber: this.user.phoneNumber,
          lastLoginAt: this.user.lastLoginAt,
          emailVerified: this.user.emailVerified,
          displayName: this.user.displayName,
          createAt: this.user.createAt,
          email: this.user.email
        }));
        this.router.navigate(['/']);
        this.toastrService.success(this.translateService.instant('user.signin.login_success'));
      }
    })
      .catch(
        (err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          log.error(errorCode, errorMessage);
          this.toastrService.error(this.translateService.instant('user.signin.login_error'));
        });
  }
}
