import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import Chart from 'chart.js/auto';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';

/**
 * Wrapper minimal autour de chart.js v4 (remplace angular2-chartjs).
 * Conserve la même API de template : <chart [type] [data] [options]>.
 */
@Component({
  selector: 'app-chart',
  standalone: false,
  template: '<canvas #canvas></canvas>',
  styles: [':host { display: block; position: relative; }']
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() type: ChartType = 'bar';
  @Input() data: ChartData;
  @Input() options: ChartOptions = {};

  @ViewChild('canvas', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;
  private chart: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chart) {
      return;
    }
    if (changes.type) {
      this.chart.destroy();
      this.createChart();
      return;
    }
    this.chart.data = this.data;
    this.chart.options = this.options as never;
    this.chart.update();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private createChart(): void {
    if (!this.data) {
      return;
    }
    this.chart = new Chart(this.canvas.nativeElement, {
      type: this.type,
      data: this.data,
      options: this.options
    });
  }
}
