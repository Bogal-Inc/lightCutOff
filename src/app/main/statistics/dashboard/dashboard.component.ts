import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../../core/services-firebase/report.service';
import {Report, ReportSatus} from '@Models/report.model';
import {faChartArea, faChartLine, faChartPie, faChartBar} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Observable} from 'rxjs';

const log = new Logger('dashboard.component');

@Component({
  selector: 'app-report-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  reports$: Observable<Report[]>;
  reportsCurrentMonth: Report[];
  reportsYearClose: Report[];
  reportsMonthClose: Report[];
  reports: Report[];
  reportsCurrentYear: Report[];
  cards: any;

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/dashboard',
      page_path: '/dashboard',
      page_title: 'Dashboard'
    });

    this.metaService.initMetaDashboard('statistics.dashboard.title_page');
    this.initCardDashbord();
  }

  private initCardDashbord() {
    this.reportService.getReports({
      isDeleted: false
    }).subscribe(
      (reports) => {
        this.reports = reports;

        this.initReportsCollection();
        this.initDashboardCards();
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

    this.reportsYearClose = this.reportsCurrentYear.filter(
      report => report.status === ReportSatus.CUT_COMPLETED
    );

    this.reportsMonthClose = this.reportsCurrentMonth.filter(
      report => report.status === ReportSatus.CUT_COMPLETED
    );
  }

  private initDashboardCards() {
    this.cards = [
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_all_title'),
        body: this.reports.length,
        icon: faChartLine,
        style: 'border-left-success'
      },
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_current_year_title'),
        body: this.reportsCurrentYear.length,
        icon: faChartPie,
        style: 'border-left-danger'
      },
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_current_month_title'),
        body: this.reportsCurrentMonth.length,
        icon: faChartArea,
        style: 'border-left-warning'
      },
      {
        title: 'rapport annuelle clos',
        body: this.reportsYearClose.length,
        icon: faChartBar,
        style: 'border-left-info'
      },
      {
        title: 'rapport mensuel clos',
        body: this.reportsMonthClose.length,
        icon: faChartArea,
        style: 'border-left-secondary'
      }
    ];
  }
}
