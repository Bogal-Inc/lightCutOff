import { Report } from '@Models/report.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-create-form-report',
  templateUrl: './create-form-report.component.html',
  styleUrls: ['./create-form-report.component.scss']
})
export class CreateFormReportComponent implements OnInit {
  @Output() reportSubmit: EventEmitter<Report> = new EventEmitter<Report>();
  @Input() lastReport: Report;
  min = new Date(2019, 12, 31);
  max = new Date();
  datetime: any;

  constructor() { }

  ngOnInit(): void {
    this.datetime = this.max;
  }

  onSubmitReport() {
    this.reportSubmit.emit(this.datetime);
  }
}
