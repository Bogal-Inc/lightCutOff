import { Component, OnInit } from '@angular/core';
import {ReportService} from '@Services/report.service';
import {Report} from '@Models/report.model';
import {convertSecondsToDate} from '@Helpers/date.helper';
import { faChartLine, faChartPie, faChartArea } from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';

const log = new Logger('dashboard.component');

@Component({
  selector: 'app-report-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cardReportsAll: any;
  card2ReportsCurrentYear: any;
  cardReportsCurrentMonth: any;
  reports: Report[];

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.initCardDashbord();
  }

  private async initCardDashbord() {
    this.reportService.getReportsAll().subscribe(
      reports => {
        this.reports = reports;
        const currentDate = new Date();

        const reportsCurrentYear = this.reports.filter(
          (report) => (convertSecondsToDate(report.reportedAt.seconds).getFullYear() === currentDate.getFullYear())
        );
        const reportsCurrentMonth = this.reports.filter(
          (report) => (convertSecondsToDate(report.reportedAt.seconds).getMonth() === currentDate.getMonth())
        );

        this.cardReportsAll = {
          title: this.translateService.instant('report.dashboard.card_reports_all_title'),
          body: this.reports.length,
          icon: faChartLine,
          style: 'bg-success'
        };

        this.card2ReportsCurrentYear = {
          title: this.translateService.instant('report.dashboard.card_reports_all_title'),
          body: reportsCurrentYear.length,
          icon: faChartPie,
          style: 'bg-danger'
        };

        this.cardReportsCurrentMonth = {
          title: this.translateService.instant('report.dashboard.card_reports_all_title'),
          body: reportsCurrentMonth.length,
          icon: faChartArea,
          style: 'bg-warning'
        };
      }
    );
  }

}
