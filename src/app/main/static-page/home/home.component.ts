import {Component, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {AuthService, ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {MetaTag, METATAG} from '@Models/metaTag.model';

const log = new Logger('home.component');

export enum PARTNERS {
  WILLY,
  EUCLIDE,
  YVAN,
  ALEX
}

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly playStoreUrl = Const.app.playStoreUrl;
  readonly faBullhorn = faBullhorn;
  closeResult = '';
  reports: any;
  reportsCurrentYear: any;
  reportsCurrentMonth: any;
  partners = [
    PARTNERS.WILLY,
    PARTNERS.EUCLIDE,
    PARTNERS.YVAN,
    PARTNERS.ALEX
  ];
  impPartnerWilly = true;
  impPartnerEuclide = true;
  impPartnerYvan = true;
  impPartnerAlex = true;
  reportsCurrentDay: Report[];
  nbrReportsDay: number;
  nbrReportsMonthly: number;
  isMobil: boolean;
  isMarkerAdded: boolean;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics,
    private reportService: ReportService,
    private authService: AuthService,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka-prod.web.app',
      page_path: '/',
      page_title: 'Home'
    });

    this.isMobil = isMobile();
    // this.metaService.initMetatoHome('core.home.title_page');
    // this.loadReports();
    this.metaService.setTagsGeneral(
      this.translateService.instant('core.home.title_page'),
      [
      new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
      new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.home.desc_page'))
    ]);
  }

  private loadReports() {
    this.reportService.getReports({
      isDeleted: false
    }).subscribe(
      (reports) => {
        this.reports = reports;

        this.isMarkerAdded = this.isCurrentUSerHaveMarkers();
        this.initReportsCollection();
      });
  }

  mouseEnter(partner: PARTNERS) {
    if (partner === PARTNERS.WILLY) {
      this.impPartnerWilly = false;
    } else if (partner === PARTNERS.EUCLIDE) {
      this.impPartnerEuclide = false;
    } else if (partner === PARTNERS.YVAN) {
      this.impPartnerYvan = false;
    } else if (partner === PARTNERS.ALEX) {
      this.impPartnerAlex = false;
    }
  }

  mouseLeave(partner: PARTNERS) {
    if (partner === PARTNERS.WILLY) {
      this.impPartnerWilly = true;
    } else if (partner === PARTNERS.EUCLIDE) {
      this.impPartnerEuclide = true;
    } else if (partner === PARTNERS.YVAN) {
      this.impPartnerYvan= true;
    } else if (partner === PARTNERS.ALEX) {
      this.impPartnerAlex = true;
    }
  }

  private isCurrentUSerHaveMarkers() {
    return this.reports.find(
      report => this.authService.getUserToLocalStorage().id === report._createdBy.id
    );
  }

  private initReportsCollection() {
    const now = new Date();

    this.reportsCurrentYear = this.reports.filter(
      report => report.reportedAt.toDate().getFullYear() === now.getFullYear()
    );

    this.reportsCurrentMonth = this.reportsCurrentYear.filter(
      report => report.reportedAt.toDate().getMonth() === now.getMonth()
    );

    this.reportsCurrentDay = this.reportsCurrentMonth.filter(
      report => report.reportedAt.toDate().getDate() === now.getDate()
    );
    this.nbrReportsMonthly = this.reportsCurrentMonth.length;
    this.nbrReportsDay = this.reportsCurrentDay.length;
  }
}
