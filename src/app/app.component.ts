import { Const } from 'src/environments/const';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Logger } from '@Services/logger.service';
import { environment } from 'src/environments/environment';
import { I18nService } from '@Services/i18n.service';

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
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('fr-FR');
    this.authService.anonymousAuth();
    this.authService.getAnonymousUser();
  }

  ngOnInit() {
    if (environment.production) {
      Logger.enableProductionMode();
    }
    log.debug('init');

    // Setup translations
    this.i18nService.init(
      Const.defaultLanguage,
      Const.supportedLanguages
    );
   }
}
