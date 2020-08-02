import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Report} from '@Models/report.model';

@Component({
  selector: 'app-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {
  chartSettings: {
    barChartData: any,
    barChartType: string,
    barChartOptions: any,
  };
  year: number;
  @Input() reportsCurrentYear: Report[];

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
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.chartSettings = {
      barChartData: {
        labels: this.barChartLabels,
        datasets: this.getReportByMonth(this.reportsCurrentYear)
      },
      barChartType: 'bar',
      barChartOptions: {
        scaleShowVerticalLines: false,
        responsive: true,
      },
    };
  }

  private getReportCityByMonth(city: string): number[] {
    const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.reportsCurrentYear.map(
      report => {
        if (report.city === city){
          months.forEach(
            (mt, index, self) => {
              const currentMonth = report.reportedAt.toDate().getMonth();
              if ((index + 1) === currentMonth) {
                self[index + 1] += 1;
              }
            }
          );
        }
      });

    return months;
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

  private getCities(reports: Report[]): string[] {
    const cities = reports.map(
      (report) => {
        return report.city;
      }
    );

    return Array.from(new Set(cities));
  }
}
