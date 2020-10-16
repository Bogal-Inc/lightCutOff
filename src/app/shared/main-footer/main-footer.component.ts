import { I18nService } from '@Services/i18n.service';
import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import { Logger } from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('loading.component');

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  appTitle = Const.app.title;
  currentLang: string;

  constructor(
    private i18nService: I18nService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    log.debug('init');
    this.currentLang = this.i18nService.language;
  }

  toggleLang() {
    log.debug('call toggleLang');

    if (this.i18nService.language === Const.app.lang.fr){
      log.debug('active lang en');
      this.analytics.logEvent('switch_lang_en');
      this.i18nService.language = Const.app.lang.en;
      this.currentLang = Const.app.lang.en;
    } else {
      log.debug('active lang Fr');
      this.analytics.logEvent('switch_lang_fr');
      this.i18nService.language = Const.app.lang.fr;
      this.currentLang = Const.app.lang.fr;
    }
  }
}
