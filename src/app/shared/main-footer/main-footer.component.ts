import { I18nService } from '@Services/i18n.service';
import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import { Logger } from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {isMobile} from '@Helpers/mobile-confirm.helper';

const log = new Logger('loading.component');

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  appTitle = Const.app.title;
  currentLang: string;
  now: Date;
  isAppDownload = isMobile();

  constructor(
    private i18nService: I18nService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    log.debug('init');
    this.currentLang = this.i18nService.language;
    log.debug('current lang', this.currentLang);
    this.now = new Date();
  }

  toggleLang() {
    const lang = (this.i18nService.language === Const.app.lang.fr) ? Const.app.lang.en : Const.app.lang.fr;
    log.debug('switch lang', lang);

    this.analytics.setUserProperties({favorite_lang: lang});
    this.i18nService.language = lang;
    this.currentLang = lang;
  }
}
