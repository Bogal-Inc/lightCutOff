import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('tuto.component');

@Component({
  standalone: false,
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss']
})
export class TutoComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly faInfoCircle = faInfoCircle;

  constructor(
    private metaService: MetaService,
    private analytics: AngularFireAnalytics,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka.app/tuto',
      page_path: '/tuto',
      page_title: 'Tutorial'
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('core.tuto.title_page'),
      [
        new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, SOCADEL, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.tuto.desc_page'))
      ]);
  }

}
