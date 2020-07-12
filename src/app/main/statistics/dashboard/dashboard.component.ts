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
  chartSettings: {
    barChartData: any,
    barChartType: string,
    barChartOptions: any,
  };
  barChartLabels = [
    this.translateService.instant('app.january'),
    this.translateService.instant('app.february'),
    this.translateService.instant('app.march'),
    this.translateService.instant('app.april'),
    this.translateService.instant('app.may'),
    this.translateService.instant('app.june'),
    this.translateService.instant('app.july'),
    this.translateService.instant('app.august'),
    this.translateService.instant('app.september'),
    this.translateService.instant('app.october'),
    this.translateService.instant('app.november'),
    this.translateService.instant('app.december'),
  ];
  backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];
  borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.initCardDashbord();
  }

  private async initCardDashbord() {
    this.reportService.getReportsAll().subscribe(
      reports => {
        const currentDate = new Date();
        this.reports = reports;

        const reportsCurrentYear = this.reports.filter(
          (report) => (convertSecondsToDate(report.reportedAt.seconds).getFullYear() === currentDate.getFullYear())
        );
        const reportsCurrentMonth = this.reports.filter(
          (report) => (convertSecondsToDate(report.reportedAt.seconds).getMonth() === currentDate.getMonth())
        );
        this.initDashboardCards(reportsCurrentYear, reportsCurrentMonth);
        this.chartSettings = {
          barChartData: {
            labels: this.barChartLabels,
            datasets: this.getReportByMonth(reportsCurrentYear)
          },
          barChartType: 'bar',
          barChartOptions: {
            scaleShowVerticalLines: false,
            responsive: true,
            // legend: this.legends
          },
        };
      }
    );
  }

  private initDashboardCards(reportsCurrentYear, reportsCurrentMonth) {
    this.cardReportsAll = {
      title: this.translateService.instant('statistics.dashboard.card_reports_all_title'),
      body: this.reports.length,
      icon: faChartLine,
      style: 'bg-success'
    };

    this.card2ReportsCurrentYear = {
      title: this.translateService.instant('statistics.dashboard.card_reports_current_year_title'),
      body: reportsCurrentYear.length,
      icon: faChartPie,
      style: 'bg-danger'
    };

    this.cardReportsCurrentMonth = {
      title: this.translateService.instant('statistics.dashboard.card_reports_current_month_title'),
      body: reportsCurrentMonth.length,
      icon: faChartArea,
      style: 'bg-warning'
    };
  }

  private getReportCityByMonth(city: string): number[] {
    const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.reports.map(
      report => {
        const currentMonth = new Date(report.reportedAt.seconds * 1000).getMonth();

        if (report.city === city){
          months.forEach(
            (mt, index, self) => {
              if ((index + 1) === currentMonth) {
                self[index] += 1;
              }
            }
          );
        }
      });
    return months;
  }

  private getCities(reports: Report[]): string[] {
    const cities = reports.map(
      (report) => {
        return report.city;
      }
    );

    return Array.from(new Set(cities));
  }

  private getReportByMonth(reports: Report[]){
    const cities = this.getCities(reports);


    return cities.map(
      (city, index) => {
        return {
          data: this.getReportCityByMonth(city),
          label: city,
          backgroundColor: this.backgroundColor[index],
          borderColor: this.borderColor[index],
        };
      }
    );
  }
}
