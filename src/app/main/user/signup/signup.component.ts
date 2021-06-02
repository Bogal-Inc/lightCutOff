import { UserService } from '../../../core/services-firebase';
import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import { User } from '@Models/user.model';
import {AngularFireAnalytics} from '@angular/fire/analytics';
// import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';

const log = new Logger('register.component');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private angularFireAnalytics: AngularFireAnalytics,
    private angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.angularFireAnalytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/register',
      page_path: '/register',
      page_title: 'register'
    });
  }

  onSubmit(user) {
    this.authService.createUser(user)
      .then((userCredential) => {
        // this.associateWithAnonymousAccount(user.email, user.password);
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

  // TODO: not working
  /*private associateWithAnonymousAccount(email, password) {
    const credential = firebase.default.auth.EmailAuthProvider.credential(email, password);

    firebase.default.auth().currentUser.linkWithCredential(credential).then((user) => {
      log.debug('Anonymous account successfully upgraded', user);
    }, (error) => {
      log.error('Error upgrading anonymous account', error);
    });
  }*/
}
