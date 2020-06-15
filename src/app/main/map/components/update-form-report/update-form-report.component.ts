import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Report } from 'src/app/core/models/report.model';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './update-form-report.component.html',
  styleUrls: ['./update-form-report.component.scss']
})
export class UpdateFormReportComponent implements OnInit {
  @Output() recovredSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() lastReport: Report;
  submitted = false;
  recovredForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initRecovredForm();
  }

  private initRecovredForm() {
    this.recovredForm = this.formBuilder.group({
      recovredAt: ['', [Validators.required]],
      recovredHour: ['', [Validators.required]],
    });
  }

  get f() { return this.recovredForm.controls; }


  onSubmitRecovred() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.recovredForm.invalid) {
      return;
    }

    const report = this.recovredForm.value;
    this.recovredSubmit.emit(report);
    this.recovredForm.reset();
  }

}
