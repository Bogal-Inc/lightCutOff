import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-current-marker',
  templateUrl: './select-current-marker.component.html',
  styleUrls: ['./select-current-marker.component.scss']
})
export class SelectCurrentMarkerComponent implements OnInit {
  cutOffForm: FormGroup;
  submitted = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm() {
    this.cutOffForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      startHour: ['', [Validators.required]],
      endDate: [''],
      endHour: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.cutOffForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.cutOffForm.invalid) {
      return;
    }

    const startDate = this.cutOffForm.get('startDate').value;
    const endDate = this.cutOffForm.get('endDate').value;
  }

  private onChanges(): void {
    this.cutOffForm.valueChanges.subscribe(val => {
      this.startDate = val.startDate;
      this.endDate = val.endDate;
    });
  }

}
