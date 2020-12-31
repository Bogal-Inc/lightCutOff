import { Injectable } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../environments/const';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  readonly projectTitle = Const.app.title;

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private metaTagService: Meta
  ) { }

  /**
   * Meta tags for home page
   */
  initMetatoHome(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, light cut off, cut off, light, electricity services, electrician near me, electric companies, no electricity, light, electricity, ' },
      { name: 'description', content: this.translateService.instant('core.home.desc_page') },
    ]);
  }

  /**
   * Meta tags for about us page
   */
  initMetatoAboutUs(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('core.aboutus.desc_page') },
    ]);
  }

  /**
   * Meta tags for static page
   */
  initMetaToStatisticsNumbers(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('statistics.dashboard.desc_page') },
    ]);
  }

  /**
   * Meta tags for tuto page
   */
  initMetatoTuto(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('core.tuto.desc_page') },
    ]);
  }

  /**
   * Meta tags for map page
   */
  initMetaMapView(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('main.map-view.desc_page') },
    ]);
  }

  /**
   * Meta tags for reports list page
   */
  initMetaReportList(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('report.report-list.title_page') },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaReportDetailMobile(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('report.report-details-mobile.title_page') },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaDashboard(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'description', content: this.translateService.instant('statistics.dashboard.title_page') },
    ]);
  }

  private initTitlePage(title: string) {
    this.titleService.setTitle(
      this.projectTitle + ' | ' + this.translateService.instant(title)
    );
  }
}
