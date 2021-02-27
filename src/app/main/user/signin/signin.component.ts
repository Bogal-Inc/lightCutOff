import {UserService} from '../../../core/services-firebase/user.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {Router} from '@angular/router';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Const} from '../../../../environments/const';

const log = new Logger('signin.component');

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  reactiveEmail = false;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router,
    private angularFireAnalytics: AngularFireAnalytics,
  ) {
  }

  ngOnInit(): void {
    log.debug('init');
    this.angularFireAnalytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/signin',
      page_path: '/signin',
      page_title: 'signin'
    });
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  onSubmit() {
    log.debug('signin');

    this.angularFireAnalytics.logEvent('loggin_user');
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
    this.reactiveEmail = false;
  }

  private logout() {
    log.debug('signout');

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
      this.user = userCredential.user;

      this.saveUserToLocalstorage();
    })
    .catch(
      (err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        log.error(errorCode, errorMessage);
        this.toastrService.error(this.translateService.instant('user.signin.login_error'));
      });
  }

  private saveUserToLocalstorage() {
    if (!this.user.emailVerified) {
      this.reactiveEmail = true;
      this.logout();
    } else {
      this.authService.currentUser$.subscribe(
        (user) => {
          this.authService.createUserToLocalStorage(user);
        }
      );

      this.router.navigate(['/']);
      this.toastrService.success(this.translateService.instant('user.signin.login_success'));
    }
  }
}
