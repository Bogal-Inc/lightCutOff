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
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne electrique, panne, report light cut off, que faire pendant une coupure de lumiere, page d\'accueil, homepage' },
      { name: 'description', content: this.translateService.instant('core.home.desc_page') },
    ]);
  }

  /**
   * Meta tags for about us page
   */
  initMetatoAboutUs(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, a propos, about us, historic, histoire, vision, qu\'est ce que lightcutoff, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne de electrique, panne, report light cut off, intelligence artificielle, machin learning' },
      { name: 'description', content: this.translateService.instant('core.aboutus.desc_page') },
    ]);
  }

  /**
   * Meta tags for static page
   */
  initMetaToStatisticsNumbers(title: string) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages' },
      { name: 'description', content: this.translateService.instant('statistics.dashboard.desc_page') },
    ]);
  }

  /**
   * Meta tags for tuto page
   */
  initMetatoTuto(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne de electrique, panne, report light cut off, que faire pendant une coupure de lumiere, comment utiliser lightcutoff, tutoriel, apprendre, learning' },
      { name: 'description', content: this.translateService.instant('core.tuto.desc_page') },
    ]);
  }

  /**
   * Meta tags for map page
   */
  initMetaMapView(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages, actualité, Economie d\'énergie, courant, courant electrique, Logo lightcutoff, délestages, coupures, signaler coupure, signalez coupure de lumiere, rapport de coupure de lumiere, rapport, panne de courant, panne de electrique, panne, report light cut off, que faire pendant une coupure de lumiere, carte interactive, map, marker, marqueur, heure de coupure de la lumiere, date de coupure de la lumiere, signaler la fin d\'une coupure de courant' },
      { name: 'description', content: this.translateService.instant('main.map-view.desc_page') },
    ]);
  }

  /**
   * Meta tags for reports list page
   */
  initMetaReportList(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages,' },
      { name: 'description', content: this.translateService.instant('report.report-list.title_page') },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaReportDetailMobile(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages,' },
      { name: 'description', content: this.translateService.instant('report.report-details-mobile.title_page') },
    ]);
  }

  /**
   * Meta tags for reports details mobile page
   */
  initMetaDashboard(title) {
    this.initTitlePage(title);

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages,' },
      { name: 'description', content: this.translateService.instant('statistics.dashboard.title_page') },
    ]);
  }

  private initTitlePage(title: string) {
    this.titleService.setTitle(
      this.projectTitle + ' | ' + this.translateService.instant(title)
    );
  }
}
