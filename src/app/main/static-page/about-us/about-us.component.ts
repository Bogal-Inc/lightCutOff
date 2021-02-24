import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('about-us.component');

@Component({
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
      page_location: 'https://lightcutoff.com/aboutus',
      page_path: '/aboutus',
      page_title: 'About'
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('core.aboutus.title_page'),
      [
      new MetaTag(METATAG.KEYWORDS, 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, a propos, about us, historic, histoire, vision, qu\'est ce que lightcutoff, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne de electrique, panne, report light cut off, intelligence artificielle, machin learning'),
      new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.aboutus.desc_page'))
    ]);
  }

}
