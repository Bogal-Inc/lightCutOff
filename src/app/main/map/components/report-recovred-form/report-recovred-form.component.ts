import { Report } from '../../../../core/models/report.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-recovred-form',
  templateUrl: './report-recovred-form.component.html',
  styleUrls: ['./report-recovred-form.component.scss']
})
export class ReportRecovredFormComponent implements OnInit {
  @Output() reportSubmit: EventEmitter<Report> = new EventEmitter<Report>();
  @Output() recovredSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() lastReport: Report;
  @Input() formLoader: boolean;

  reportForm: FormGroup;
  reportFormSubmitted = false;
  recovredForm: FormGroup;
  recovredFormSubmitted = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initReportForm();
    this.initRecovredForm();
  }

  private initReportForm() {
    // const coords = JSON.parse(localStorage.getItem('lightCutOffCoords'));
    this.reportForm = this.formBuilder.group({
      reportedAt: ['', [Validators.required]],
      reportedHour: ['', [Validators.required]]
    });
  }

  private initRecovredForm() {
    this.recovredForm = this.formBuilder.group({
      recovredAt: ['', [Validators.required]],
      recovredHour: ['', [Validators.required]],
      reportId: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get fReport() { return this.reportForm.controls; }
  get fRecovred() { return this.recovredForm.controls; }

  onSubmitReport() {
    this.reportFormSubmitted = true;

    // stop here if form is invalid
    if (this.reportForm.invalid) {
      return;
    }

    this.formLoader = true;
    const report = this.reportForm.value;
    this.reportSubmit.emit(report);

  }

  onSubmitRecovred() {
    this.recovredFormSubmitted = true;

    // stop here if form is invalid
    if (this.recovredForm.invalid) {
      return;
    }

    const report = this.recovredForm.value;
    this.recovredSubmit.emit(report);
  }
}
