import { Report } from '../../../../core/models/report.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-form-report',
  templateUrl: './create-form-report.component.html',
  styleUrls: ['./create-form-report.component.scss']
})
export class CreateFormReportComponent implements OnInit {
  @Output() reportSubmit: EventEmitter<Report> = new EventEmitter<Report>();
  @Input() lastReport: Report;
  submitted = false;
  min = new Date(2019, 12, 31);
  max = new Date();
  datetime: any;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmitReport() {
    this.submitted = true;

    this.reportSubmit.emit(this.datetime);
  }
}
