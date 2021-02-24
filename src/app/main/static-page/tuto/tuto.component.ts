import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('tuto.component');

@Component({
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
      page_location: 'https://lightcutoff.com/tuto',
      page_path: '/tuto',
      page_title: 'Tutorial'
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('core.tuto.title_page'),
      [
        new MetaTag(METATAG.KEYWORDS, 'lightcutoff, service information light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne de electrique, panne, report light cut off, que faire pendant une coupure de lumiere, comment utiliser lightcutoff, tutoriel, apprendre, learning'),
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.tuto.desc_page'))
      ]);
  }

}
