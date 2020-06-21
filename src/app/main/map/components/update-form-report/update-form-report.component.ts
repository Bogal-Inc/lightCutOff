import { Report } from 'src/app/core/models/report.model';
import { ReportService } from './../../../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { compareDate } from 'src/app/core/_helper/date.helper';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './update-form-report.component.html',
  styleUrls: ['./update-form-report.component.scss']
})
export class UpdateFormReportComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  private _report: Report;

  @Input() set report(value: Report){
    this._report = value;
    this.min = (this.report) ? new Date(this.report.reportedAt.seconde * 1000) : new Date(2019, 12, 31);
  }
  get report() {
    return this._report;
  }

  datetime: any;
  min: Date;
  max: Date;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService
  ) {
    this.min = new Date(2019, 12, 31);
    this.max = new Date();
  }

  ngOnInit(): void { }

  onSubmitRecovred() {

    if (!this.isDate(this.report.reportedAt)) {
      this.toastrService.error('La date de fin d\'un rapport doit être plus récente que celle de création');
      return ;
    }

    this.report.recovredAt = this.datetime;
    this.report._updatedAt = this.datetime;

    this.reportService.updateReport(this.report).then(
      () => {
        this.toastrService.success('Merci', 'Rapport modifié');
      }
    );
  }

  private isDate(reportedDate: any): boolean {
    if (reportedDate.seconds) {
      if (!compareDate(this.datetime, new Date(reportedDate.seconds))) {
        return false;
      }
    } else {
      if (!compareDate(this.datetime, new Date(reportedDate))) {
        return false;
      }
    }
    return true;
  }

}
