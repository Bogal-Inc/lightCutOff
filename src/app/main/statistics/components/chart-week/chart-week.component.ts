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

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {

    this.initChart();
    console.log(this.initDataOfWeek())
  }

  private initChart() {
    this.year = new Date().getFullYear();
    this.chartSettings = {
      barChartData: {
        labels: this.getCurrentWeekDates(true),
        datasets: [this.initDataOfWeek()]
      },
      barChartType: 'line',
      barChartOptions: {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: false
      },
    };
  }

  private getCurrentWeekDates(label = false): Date[]{
    const curr = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      if (label) {
        week.push(this.dateFormat.format(new Date(curr.setDate(first))));
      } else {
        week.push(new Date(curr.setDate(first)));
      }
    }
    return week;
  }

  private initDataOfWeek(): any {
    const daysOfWeek = this.getCurrentWeekDates();
    const reports = [];

    daysOfWeek.forEach(
      date => {
        reports.push(this.getDayData(date));
      }
    );
    return {
      label: 'Reports',
      data: reports
    };
  }

  private getDayData(date: Date): number {
    let reports = 0;

    this.reportsCurrentYear.filter(
      data => {
        if (date.getDate() === data.reportedAt.toDate().getDate()) {
          reports += 1;
        }
      }
    );

    return reports;
  }

}
