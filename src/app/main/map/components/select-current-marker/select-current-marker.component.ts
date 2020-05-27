import { Position, Report } from './../../../../core/models/report.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/store/report/report.service';
import * as uuid from 'uuid';
// import { isValidReportedDate } from 'src/app/core/_helper/isValidReportedDate.validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-select-current-marker',
  templateUrl: './select-current-marker.component.html',
  styleUrls: ['./select-current-marker.component.scss']
})
export class SelectCurrentMarkerComponent implements OnInit {
  @Input() position: Position;
  @Output() reportSubmit: EventEmitter<Report> = new EventEmitter<Report>();

  reportForm: FormGroup;
  reportFormsubmitted = false;
  // restoreForm: FormGroup;

  reportedAt: NgbDateStruct;
  restoredAt: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private toastr: ToastrService
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
