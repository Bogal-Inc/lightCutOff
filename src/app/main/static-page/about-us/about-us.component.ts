import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('about-us.component');

@Component({
  standalone: false,
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  readonly projectTitle = Const.app.title;

  constructor(
    private metaService: MetaService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka-prod.web.app/aboutus',
      page_path: '/aboutus',
      page_title: 'About'
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('core.aboutus.title_page'),
      [
      new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
      new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.aboutus.desc_page'))
    ]);
  }

}
