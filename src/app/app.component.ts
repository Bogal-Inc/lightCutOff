import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import {AuthService} from './core/services-firebase';
import { Logger } from '@Services/logger.service';
import { environment } from 'src/environments/environment';
import { I18nService } from '@Services/i18n.service';
import {User} from '@Models/user.model';

/** Initialize Logger */
const log = new Logger('app.component');

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = Const.app.title;
  user: User;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService
  ) {
    // session anonyme par défaut (modèle anonyme-first de Njuka) :
    // indispensable pour lire Firestore, les règles exigent isSignedIn()
    this.user = this.authService.getUserToLocalStorage();
    if (!this.user || !this.user.email) {
      this.signInAnonymously();
    }
  }

  ngOnInit() {
    if (environment.production) {
      log.debug('mode production active');
      Logger.enableProductionMode();
    }
    log.debug('init');

    // Setup translations
    const defaultLang = localStorage.getItem(Const.app.lang.localstorage_title);
    this.i18nService.init(
      defaultLang ? defaultLang : Const.app.lang.fr,
      [Const.app.lang.fr, Const.app.lang.en]
    );
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
}
