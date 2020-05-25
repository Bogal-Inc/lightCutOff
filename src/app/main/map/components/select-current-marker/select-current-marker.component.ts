import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/store/report/report.service';
import * as uuid from 'uuid';
import { ngbToFbTimestamp } from 'src/app/core/_helper/ngbToFbTimestamp.cast';
import { isValidReportedDate } from 'src/app/core/_helper/isValidReportedDate.validator';


@Component({
  selector: 'app-select-current-marker',
  templateUrl: './select-current-marker.component.html',
  styleUrls: ['./select-current-marker.component.scss']
})
export class SelectCurrentMarkerComponent implements OnInit {
  reportForm: FormGroup;
  // restoreForm: FormGroup;
  reportFormsubmitted = false;
  reportedAt: NgbDateStruct;
  restoredAt: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm() {
    const coords = JSON.parse(localStorage.getItem('lightCutOffCoords'));
    this.reportForm = this.formBuilder.group({
      reportedAt: ['', [Validators.required]],
      reportedHour: ['', [Validators.required]],
      lat: [coords.lat, [Validators.required]],
      lng: [coords.lng, [Validators.required]]
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

  onSubmit() {
    this.reportFormsubmitted = true;

    // stop here if form is invalid
    if (this.reportForm.invalid) {
      return;
    }

    const report = this.reportForm.value;
    const now = ngbToFbTimestamp();

    this.reportService.createReport({
      id: uuid.v4(),
      acceptLangage: 'test_acceptLangage',
      createdAt: now,
      deletedAt: now,
      position: {
        longitude: report.lng,
        latitude: report.lat
      },
      reportedAt: ngbToFbTimestamp(report.reportedAt, report.reportedHour),
      restoredAt: now,
      updatedAt: now,
      userAgent: 'test_userAgent'
    }).then(
      resp => {
        this.reportFormsubmitted = false;
        this.reportForm.reset();
      }
    );
  }

  private onChanges(): void {
    this.reportForm.valueChanges.subscribe(val => {
      this.reportedAt = val.reportedAt;
      this.restoredAt = val.restoredAt;
    });
  }
}
