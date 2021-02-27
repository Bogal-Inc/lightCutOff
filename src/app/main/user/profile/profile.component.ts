import {AuthService, UserService} from '../../../core/services-firebase';
import { Component, OnInit } from '@angular/core';
import { Logger } from '@Services/logger.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../../environments/const';

const log = new Logger('signup.component');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = null;
  ativedForm = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
    private toastrService: ToastrService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com',
      page_path: '/profile',
      page_title: 'Profile'
    });

    this.user = this.authService.getUserLogged();
  }

  onSubmit(user) {
    this.userService.updateUser(user).then(
      data => {
        log.debug('update successed');

        window.localStorage.setItem(Const.user.localstorage, JSON.stringify({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          email: user.email,
          gender: user.gender,
          role: user.roles,
          birthday: user.birthday
        }));
        this.ativedForm = false;
        this.user = this.authService.getUserLogged();

        this.toastrService.success(this.translateService.instant('user.profile.update_success'));
      },
      error => {
        log.error('update failed', error);
        this.toastrService.error(this.translateService.instant('user.profile.update_error'));
      }
    );
  }

  activeUpdateForm() {
    this.ativedForm = !this.ativedForm;
  }
}
