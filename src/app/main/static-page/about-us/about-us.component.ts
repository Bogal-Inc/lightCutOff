import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

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
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/aboutus',
      page_path: '/aboutus',
      page_title: 'About'
    });

    this.metaService.initMetatoAboutUs('core.aboutus.title_page');
  }

}
