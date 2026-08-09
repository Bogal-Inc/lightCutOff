import { I18nService } from '@Services/i18n.service';
import { Const } from 'src/environments/const';
import {Component, OnInit} from '@angular/core';
import { Logger } from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {isMobile} from '@Helpers/mobile-confirm.helper';

const log = new Logger('loading.component');

@Component({
  standalone: false,
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  appTitle = Const.app.title;
  currentLang: string;
  now: Date;

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

}
