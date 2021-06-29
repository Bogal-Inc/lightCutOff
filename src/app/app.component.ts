import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import {AuthService, MessagingService} from './core/services-firebase';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Logger } from '@Services/logger.service';
import { environment } from 'src/environments/environment';
import { I18nService } from '@Services/i18n.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessagingComponent} from './modals/messaging/messaging.component';
import {User} from '@Models/user.model';

// const firebase = require('firebase/app');
/** Initialize Logger */
const log = new Logger('app.component');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = Const.app.title;
  user: User;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private toastrService: ToastrService,
    private angularFirestore: AngularFirestore,
    private messagingService: MessagingService,
    // private ccService: NgcCookieConsentService,
    private analytics: AngularFireAnalytics,
    private modalService: NgbModal,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('fr-FR');

    // if user logged we don't use anonymous informations
    this.user = this.authService.getUserToLocalStorage();
    if(this.user && !this.user.email) {
      this.signInAnonymously();
    }
  }

  ngOnInit() {
    if (environment.production) {
      log.debug('mode production active');
      Logger.enableProductionMode();
    }
    log.debug('init');

    // this.initCacheSystem();

    // Setup translations
    const defaultLang = localStorage.getItem(Const.app.lang.localstorage_title);
    this.i18nService.init(
      defaultLang ? defaultLang : Const.app.lang.fr,
      [Const.app.lang.fr, Const.app.lang.en]
    );

    // this.initCookiesConsient();

    if (environment.app.modules.messaging) {
      this.openModalMessaging();
      this.messagingService.listen().subscribe((message: any) => {
        this.toastrService.info(message.notification.body, message.notification.title);
      });
    }
  }

  private openModalMessaging() {
    if (Notification.permission === 'granted') {
      log.debug('Notifications browser actived');
    } else {
      log.debug('Notifications browser disabled');
      this.modalService.open(MessagingComponent, { centered: true });
    }
  }

  private signInAnonymously() {
    this.authService.anonymousAuth()
      .then(() => {
        log.debug('signIn anonymously');
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message ;
        log.debug(errorCode, errorMessage);
      });
    this.authService.getAnonymousUser();
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

  // TODO: offline mode
  /*private initCacheSystem() {
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
  }*/
}
