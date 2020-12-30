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
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'LightCutOff is a collaborative platform that allows its users to help each other on the issue of the availability of electrical energy in order to be able to readjust their lifestyle and possibly optimize the management of their resources and their activities.' },
    ]);
  }

  /**
   * Meta tags for about us page
   */
  initMetatoAboutUs(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for about us page
   */
  initMetaToStatisticsNumbers(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for tuto page
   */
  initMetatoTuto(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for map page
   */
  initMetaMapView(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for reports list page
   */
  initMetaReportList(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaReportDetailMobile(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaDashboard(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular, électricité, cameroun' },
      { name: 'title', content: this.projectTitle + ' - ' + this.translateService.instant('core.home.title_page') },
      { name: 'description', content: 'Angular, électricité, cameroun' },
    ]);
  }

  private initTitlePage(title: string) {
    this.titleService.setTitle(
      this.projectTitle + ' - ' + this.translateService.instant(title)
    );
  }
}
