import {Component, OnInit} from '@angular/core';
import {ReportService} from '@Services/report.service';
import {Report, ReportSatus} from '@Models/report.model';
import {faChartArea, faChartLine, faChartPie} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

const log = new Logger('dashboard.component');

@Component({
  selector: 'app-report-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  reports$: Observable<Report[]>;
  card2ReportsCurrentYear: Report[];
  reportsCurrentMonth: Report[];
  reportsYearClose: Report[];
  reportsMonthClose: Report[];
  reports: Report[];
  reportsCurrentYear: Report[];
  cards: any;
  readonly projectTitle = Const.app.title;

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('dashboard_page');

    this.metaService.initMetatoAboutUs('statistics.dashboard.title_page');
    this.initCardDashbord();
  }

  private initCardDashbord() {
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      limit: 10
    }).pipe(
      tap((data) => {
        this.reports = data;

        this.initReportsCollection();
        this.initDashboardCards();
      })
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

    this.reportsYearClose = this.reportsCurrentYear.filter(
      report => report.status === ReportSatus.CUT
    );

    this.reportsMonthClose = this.reportsCurrentMonth.filter(
      report => report.status === ReportSatus.CUT
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
        icon: faChartArea,
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
