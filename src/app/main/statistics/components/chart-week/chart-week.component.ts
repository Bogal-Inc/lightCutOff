import {Component, Input, OnInit} from '@angular/core';
import {Report} from '@Models/report.model';
import {I18nService} from '@Services/i18n.service';

@Component({
  selector: 'app-chart-week',
  templateUrl: './chart-week.component.html',
  styleUrls: ['./chart-week.component.scss']
})
export class ChartWeekComponent implements OnInit {
  @Input() reportsCurrentYear: Report[];
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

  private initChart() {
    this.year = new Date().getFullYear();
    this.chartSettings = {
      barChartData: {
        labels: this.getCurrentWeekDates(true),
        datasets: [
          this.initDataOfWeek(true),
          this.initDataOfWeek(false)
        ]
      },
      barChartType: 'line',
      barChartOptions: {
        scaleShowVerticalLines: false,
        responsive: true,
      },
    };
  }

  private getCurrentWeekDates(label = false): Date[]{
    const curr = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = curr.getDay() - curr.getDay() + i;
      if (label) {
        week.push(this.dateFormat.format(new Date(curr.setDate(first))));
      } else {
        week.push(new Date(curr.setDate(first)));
      }
    }
    return week;
  }

  private initDataOfWeek(close = true): any {
    const daysOfWeek = this.getCurrentWeekDates();
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
      borderColor: this.borderColor[colorIndex],
    };
  }

  private getDayData(date: Date, close: boolean): number {
    let reports = 0;

    this.reportsCurrentYear.filter(
      data => {
        if (date.toDateString() === data.reportedAt.toDate().toDateString()) {
          if (close && data.recovredAt !== null) {
            reports += 1;
          } else if (!close && data.recovredAt === null)  {
            reports += 1;
          }
        }
      }
    );

    return reports;
  }

}
