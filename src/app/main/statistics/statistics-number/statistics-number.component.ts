import { Component, OnInit } from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Const} from '../../../../environments/const';
import {Observable} from 'rxjs';
import {ReportService} from '../../../core/services-firebase/report.service';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Logger} from '@Services/logger.service';

const log = new Logger('statistics-number.component');

@Component({
  selector: 'app-statistics-number',
  templateUrl: './statistics-number.component.html',
  styleUrls: ['./statistics-number.component.scss']
})
export class StatisticsNumberComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  reports$: Observable<Report[]>;
  reportsCurrentMonth: Report[];
  reportsCurrentDaily: Report[];
  reportsYearlyClose: Report[];
  reportsMonthlyClose: Report[];
  reportsDailyClose: Report[];
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
      page_location: 'https://lightcutoff.com/statistics_numbers',
      page_path: '/statistics_numbers',
      page_title: 'statistics numbers'
    });

    this.metaService.initMetaToStatisticsNumbers('statistics.statistics-number.title_page');
    this.initCardDashbord();
  }

  private initReportsCollection() {
    const now = new Date();

    this.reportsCurrentYear = this.reports.filter(
      report => report.reportedAt.toDate().getFullYear() === now.getFullYear()
    );

    this.reportsCurrentMonth = this.reportsCurrentYear.filter(
      report => report.reportedAt.toDate().getMonth() === now.getMonth()
    );

    this.reportsCurrentDaily = this.reportsCurrentMonth.filter(
      report => report.reportedAt.toDate().getDate() === now.getDate()
    );

    this.reportsYearlyClose = this.reportsCurrentYear.filter(
      report => report.status === ReportSatus.CUT_COMPLETED
    );

    this.reportsMonthlyClose = this.reportsCurrentMonth.filter(
      report => report.status === ReportSatus.CUT_COMPLETED
    );

    this.reportsDailyClose = this.reportsCurrentMonth.filter(
      report => report.status === ReportSatus.CUT_COMPLETED
    );
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
}
