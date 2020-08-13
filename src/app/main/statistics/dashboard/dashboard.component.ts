import { Component, OnInit } from '@angular/core';
import {ReportService} from '@Services/report.service';
import {Report} from '@Models/report.model';
import { faChartLine, faChartPie, faChartArea } from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {Title} from '@angular/platform-browser';
import {Const} from '../../../../environments/const';

const log = new Logger('dashboard.component');

@Component({
  selector: 'app-report-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  card2ReportsCurrentYear: Report[];
  cardReportsCurrentMonth: Report[];
  reports: Report[];
  reportsCurrentYear: Report[];
  cards: any;
  projectTitle = Const.app.title;

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.titleService.setTitle(
      this.projectTitle + ' - ' + this.translateService.instant('statistics.dashboard.title_page')
    );

    this.initCardDashbord();
  }

  private async initCardDashbord() {
    const now = new Date();

    this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear() + '/1/1')
    }).subscribe(
      reports => {
        const currentDate = new Date();
        this.reports = reports;

        this.reportsCurrentYear = this.reports.filter(
          (report) => (report.reportedAt.toDate().getFullYear() === currentDate.getFullYear())
        );

        this.cardReportsCurrentMonth = this.reports.filter(
          (report) => (report.reportedAt.toDate().getMonth() === currentDate.getMonth())
        );

        this.initDashboardCards(this.reportsCurrentYear, this.cardReportsCurrentMonth);
      }
    );
  }

  private initDashboardCards(reportsCurrentYear, reportsCurrentMonth) {
    this.cards = [
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_all_title'),
        body: this.reports.length,
        icon: faChartLine,
        style: 'bg-success'
      },
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_current_year_title'),
        body: reportsCurrentYear.length,
        icon: faChartPie,
        style: 'bg-danger'
      },
      {
        title: this.translateService.instant('statistics.dashboard.card_reports_current_month_title'),
        body: reportsCurrentMonth.length,
        icon: faChartArea,
        style: 'bg-warning'
      }
    ];

    // this.cardReportsAll = {
    //   title: this.translateService.instant('statistics.dashboard.card_reports_all_title'),
    //   body: this.reports.length,
    //   icon: faChartLine,
    //   style: 'bg-success'
    // };
    //
    // this.card2ReportsCurrentYear = {
    //   title: this.translateService.instant('statistics.dashboard.card_reports_current_year_title'),
    //   body: reportsCurrentYear.length,
    //   icon: faChartPie,
    //   style: 'bg-danger'
    // };
    //
    // this.cardReportsCurrentMonth = {
    //   title: this.translateService.instant('statistics.dashboard.card_reports_current_month_title'),
    //   body: reportsCurrentMonth.length,
    //   icon: faChartArea,
    //   style: 'bg-warning'
    // };
  }
}
