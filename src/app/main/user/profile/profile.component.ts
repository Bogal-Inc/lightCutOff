import { AuthService } from './../../../core/services-firebase/auth.service';
import { Component, OnInit } from '@angular/core';
import { Logger } from '@Services/logger.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

const log = new Logger('signup.component');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(
    private authService: AuthService,
    private analytics: AngularFireAnalytics
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

}
