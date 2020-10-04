import {Component, Input, OnInit} from '@angular/core';
import {Report} from '@Models/report.model';
import {I18nService} from '@Services/i18n.service';

@Component({
  selector: 'app-chart-daily-report',
  templateUrl: './chart-daily-report.component.html',
  styleUrls: ['./chart-daily-report.component.scss']
})
export class ChartDailyReportComponent implements OnInit {
  @Input() reportsCurrentMonth: Report[];
  year: number;
  chartSettings: {
    barChartData: any,
    barChartType: string,
    barChartOptions: any,
  };
  dateFormat = new Intl.DateTimeFormat(
    this.i18nService.language,
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  });

  backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(75, 192, 192, 0.2)'
  ];
  borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(75, 192, 192, 1)'
  ];

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.initChart();
  }

  private last7Days(format = false) {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (format) {
        result.push(this.dateFormat.format(d));
      } else {
        result.push(d);
      }
    }
    return result;
  }

  private initChart() {
    this.year = new Date().getFullYear();
    this.chartSettings = {
      barChartData: {
        labels: this.last7Days(true).reverse(),
        datasets: [
          this.getDataset(true),
          this.getDataset(false)
        ]
      },
      barChartType: 'line',
      barChartOptions: {
        scaleShowVerticalLines: false,
        responsive: true,
      },
    };
  }

  private getDataset(close = true): any {
    const daysOfWeek = this.last7Days().reverse();
    const reports = [];
    const colorIndex = (close) ? 1 : 0;

    daysOfWeek.forEach(
      date => {
        reports.push(this.getDayData(date, close));
      }
    );

    return {
      label: close ? 'Report close' : 'Report in progress',
      data: reports,
      backgroundColor: this.backgroundColor[colorIndex],
      borderColor: this.borderColor[colorIndex]
    };
  }

  private getDayData(date: Date, close: boolean): number {
    let reports = 0;

    this.reportsCurrentMonth.map(
      data => {
        if (close && date.toDateString() === data.reportedAt.toDate().toDateString()) {
          reports += 1;
        } else if (!close && date.toDateString() === data.recovredAt?.toDate().toDateString())  {
          reports += 1;
        }
      }
    );

    return reports;
  }

}
