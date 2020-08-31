import { Const } from 'src/environments/const';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@Services/auth.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Logger } from '@Services/logger.service';
import { environment } from 'src/environments/environment';
import { I18nService } from '@Services/i18n.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AngularFirestore} from '@angular/fire/firestore';

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

    // firebase.analytics();
    this.initCacheSystem();

    // Setup translations
    const defaultLang = localStorage.getItem(Const.app.lang.localstorage_title);
    this.i18nService.init(
      defaultLang ? defaultLang : Const.app.lang.fr,
      [Const.app.lang.fr, Const.app.lang.en]
    );
  }

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
