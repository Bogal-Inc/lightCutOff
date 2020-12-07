import {Component, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faPlayCircle, faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';

const log = new Logger('home.component');

export enum PARTNERS {
  WILLY,
  EUCLIDE,
  JAURES
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly faPlayCircle = faPlayCircle;
  readonly faBullhorn = faBullhorn;
  closeResult = '';
  reports: any;
  reportsCurrentYear: any;
  reportsCurrentMonth: any;
  partners = [
    PARTNERS.WILLY,
    PARTNERS.EUCLIDE,
    PARTNERS.JAURES
  ];
  impPartnerWilly = true;
  impPartnerEuclide = true;
  impPartnerJaures = true;
  reportsCurrentDay: Report[];
  nbrReportsDay: number;
  nbrReportsMonthly: number;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics,
    private reportService: ReportService,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com',
      page_path: '/',
      page_title: 'Home'
    });

    this.metaService.initMetatoHome('core.home.title_page');
    this.initCardDashbord();
  }

  openModal(content) {
    this.analytics.logEvent('tutorial_video');
    this.modalService.open(content);
  }

  private initCardDashbord() {
    this.reportService.getReports({
      isDeleted: false
    }).subscribe(
      (reports) => {
        this.reports = reports;

        this.initReportsCollection();
      });
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

  mouseEnter(partner: PARTNERS) {
    if (partner === PARTNERS.WILLY) {
      this.impPartnerWilly = false;
    } else if (partner === PARTNERS.EUCLIDE) {
      this.impPartnerEuclide = false;
    } else {
      this.impPartnerJaures = false;
    }
  }

  mouseLeave(partner: PARTNERS) {
    if (partner === PARTNERS.WILLY) {
      this.impPartnerWilly = true;
    } else if (partner === PARTNERS.EUCLIDE) {
      this.impPartnerEuclide = true;
    } else {
      this.impPartnerJaures = true;
    }
  }
}
