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
  reportForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initReportForm();
  }

  private initReportForm() {
    // const coords = JSON.parse(localStorage.getItem('lightCutOffCoords'));
    this.reportForm = this.formBuilder.group({
      reportedAt: ['', [Validators.required]],
      reportedHour: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.reportForm.controls; }

  onSubmitReport() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.reportForm.invalid) {
      return;
    }

    const report = this.reportForm.value;
    this.reportSubmit.emit(report);
    this.reportForm.reset();
  }
}
