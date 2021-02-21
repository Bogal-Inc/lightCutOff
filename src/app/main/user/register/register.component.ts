import { UserService } from './../../../core/services-firebase/user.service';
import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MustMatch} from '@Helpers/must-match.validator';
import {AuthService} from '../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import { User } from '@Models/user.model';
import {AngularFireAnalytics} from '@angular/fire/analytics';


const log = new Logger('register.component');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  successed = false;
  cguError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private angularFireAnalytics: AngularFireAnalytics,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.angularFireAnalytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/register',
      page_path: '/register',
      page_title: 'register'
    });

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
    this.angularFireAnalytics.logEvent('added_user');
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
        this.sendEmaiVerification(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        log.error(errorCode, errorMessage);
        this.toastrService.error(
          (errorCode === 'auth/email-already-in-use') ?
          this.translateService.instant('user.register.error_email_exist') :
          this.translateService.instant('user.register.save_error')
        );
      })
      .finally(() => {
        this.cguError = false;
        this.submitted = false;
      });
  }

  private sendEmaiVerification(userCredential) {
    userCredential.sendEmailVerification().then(() => {
      log.debug('Validation email send');
      const user = {
        id: userCredential.uid,
        email: userCredential.email,
        _createdAt: userCredential.metadata.creationTime
      } as User;

      this.createUser(user);
    }).catch((error) => {
      log.error(error);
      this.toastrService.error(this.translateService.instant('user.register.save_error'));
    });
  }

  private createUser(user){
    this.userService.createUser(user).then(
      (userTmp) => {
        log.debug('add user in user collection');
        this.successed = true;
        this.toastrService.success(
          this.translateService.instant('user.register.success_message')
        );
      }
    )
    .catch(
      error => {
        log.error(error);
        this.toastrService.error(this.translateService.instant('user.register.save_error'));
      }
    );
  }
}
