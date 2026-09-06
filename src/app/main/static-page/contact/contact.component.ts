import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import { MetaService } from '@Services/meta.service';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { environment } from 'src/environments/environment';
import { METATAG, MetaTag } from '@Models/metaTag.model';

const log = new Logger('contact.component');

@Component({
  standalone: false,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly supportEmail = Const.emailService.support;
  /** Réseaux sociaux du projet (comptes historiques — à mettre à jour si comptes Njuka). */
  readonly socialLinks = [
    { icon: 'fab fa-facebook-f', label: 'Facebook', url: 'https://www.facebook.com/people/Njuka/61594118312822/' },
    { icon: 'fab fa-twitter', label: 'Twitter / X', url: 'https://twitter.com/LightCutOff1' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/lightcutoff/' }
  ];

  constructor(
    private metaService: MetaService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: `${environment.domain}/contact`,
      page_path: '/contact',
      page_title: 'Contact'
    });

    this.metaService.setTagsGeneral(
      this.translateService.instant('core.home.contactus.title'),
      [
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.home.contactus.subtitle'))
      ]);
  }
}
