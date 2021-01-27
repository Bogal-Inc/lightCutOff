import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import { AuthService } from './core/services-firebase/auth.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Logger } from '@Services/logger.service';
import { environment } from 'src/environments/environment';
import { I18nService } from '@Services/i18n.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const firebase = require('firebase/app');
/** Initialize Logger */
const log = new Logger('app.component');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = Const.app.title;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private angularFirestore: AngularFirestore,
    // private ccService: NgcCookieConsentService,
    private analytics: AngularFireAnalytics,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('fr-FR');
    this.authService.anonymousAuth();
    this.authService.getAnonymousUser();
  }

  ngOnInit() {
    if (environment.production) {
      log.debug('mode production active');
      Logger.enableProductionMode();
    }
    log.debug('init');

    this.initCacheSystem();

    // Setup translations
    const defaultLang = localStorage.getItem(Const.app.lang.localstorage_title);
    this.i18nService.init(
      defaultLang ? defaultLang : Const.app.lang.fr,
      [Const.app.lang.fr, Const.app.lang.en]
    );

    // this.initCookiesConsient();
  }

  // private initCookiesConsient() {
  //   this.translateService//
  //     .get([
  //       'shared.cookie.header',
  //       'shared.cookie.message',
  //       'shared.cookie.dismiss',
  //       'shared.cookie.allow',
  //       'shared.cookie.deny',
  //       'shared.cookie.link',
  //       'shared.cookie.policy'
  //     ])
  //     .subscribe(data => {
  //
  //       this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
  //       // Override default messages with the translated ones
  //       this.ccService.getConfig().content.header = data['shared.cookie.header'];
  //       this.ccService.getConfig().content.message = data['shared.cookie.message'];
  //       this.ccService.getConfig().content.dismiss = data['shared.cookie.dismiss'];
  //       this.ccService.getConfig().content.allow = data['shared.cookie.allow'];
  //       this.ccService.getConfig().content.deny = data['shared.cookie.deny'];
  //       this.ccService.getConfig().content.link = data['shared.cookie.link'];
  //       this.ccService.getConfig().content.policy = data['shared.cookie.policy'];
  //
  //       this.ccService.destroy(); // remove previous cookie bar (with default messages)
  //       this.ccService.init(this.ccService.getConfig()); // update config with translated messages
  //     });
  // }

  private initCacheSystem() {
    const settings = {
      // timestampsInSnapshots: true,
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    };
    this.angularFirestore.firestore.settings(settings);

    firebase.firestore()
      .enablePersistence()
        .catch (
          (err) => {
            log.debug('system cache fail', err);
            if (err.code === 'fail-precondition') {
              this.toastrService.info(this.translateService.instant('app.fail-precondition'));
              return;
            } else if (err.code === 'non implémenté') {
              this.toastrService.info(this.translateService.instant('app.no-implement'));
              return;
            }
      });

  }
}
