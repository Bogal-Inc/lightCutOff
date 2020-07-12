import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() title: string;
  @Input() chartSettings: {
    barChartData: any,
    barChartLabels: any,
    barChartType: string,
    barChartOptions: any,
    barChartLegend: boolean
  };
  year: number;

  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }
}
