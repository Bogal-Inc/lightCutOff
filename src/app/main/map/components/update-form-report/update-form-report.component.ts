import { Report } from 'src/app/core/models/report.model';
import { ReportService } from './../../../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ngbToDate } from 'src/app/core/_helper/date.helper';
import { compareDate } from 'src/app/core/_helper/date.helper';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './update-form-report.component.html',
  styleUrls: ['./update-form-report.component.scss']
})
export class UpdateFormReportComponent implements OnInit {
  @Output() recovredSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() report: Report;
  submitted = false;
  recovredForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private toastrService: ToastrService
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

    const reportFormValue = this.recovredForm.value;
    this.report.recovredAt = ngbToDate(reportFormValue.recovredAt, reportFormValue.recovredHour);
    this.report._updatedAt = ngbToDate();

    if (!compareDate(new Date(this.report.recovredAt), new Date(this.report.reportedAt))) {
      this.toastrService.error('La date de fin d\'un rapport doit être plus récente que celle de création');
      this.submitted = false;
      return ;
    }

    this.reportService.updateReport(this.report).then(
      () => {
        this.submitted = false;
        this.recovredForm.reset();
        this.toastrService.success('Merci', 'Rapport modifié');
      },
      () => this.submitted = false
    );
  }

}
