import { Report } from '../../../../core/models/report.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-recovred-form',
  templateUrl: './report-recovred-form.component.html',
  styleUrls: ['./report-recovred-form.component.scss']
})
export class ReportRecovredFormComponent implements OnInit {
  @Output() reportSubmit: EventEmitter<Report> = new EventEmitter<Report>();

  reportForm: FormGroup;
  reportFormsubmitted = false;
  // restoreForm: FormGroup;

  reportedAt: NgbDateStruct;
  restoredAt: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm() {
    const coords = JSON.parse(localStorage.getItem('lightCutOffCoords'));
    this.reportForm = this.formBuilder.group({
      reportedAt: ['', [Validators.required]],
      reportedHour: ['', [Validators.required]]
    });
    // this.restoreForm = this.formBuilder.group({
    //   restoredAt: ['', [Validators.required]],
    //   restoredHour: ['', [Validators.required]],
    // },
    // {
    //   validator: isValidReportedDate('reportedAt', 'restoredAt', 'reportedHour', 'restoredHour')
    // });
  }

  // convenience getter for easy access to form fields
  get f() { return this.reportForm.controls; }

  onSubmitReport() {
    this.reportFormsubmitted = true;

    // stop here if form is invalid
    if (this.reportForm.invalid) {
      return;
    }

    const report = this.reportForm.value;
    this.reportSubmit.emit(report);
    this.reportForm.reset();
  }

  private onChanges(): void {
    this.reportForm.valueChanges.subscribe(val => {
      this.reportedAt = val.reportedAt;
      this.restoredAt = val.restoredAt;
    });
  }
}
