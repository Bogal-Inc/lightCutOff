import { ReportService } from '@Services/report.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { compareDate } from '@Helpers/date.helper';
import { BaseComponent } from '@Models/baseComponent.model';
import { Report } from '@Models/report.model';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './update-form-report.component.html',
  styleUrls: ['./update-form-report.component.scss']
})
export class UpdateFormReportComponent implements OnInit, BaseComponent {
  data: Report;
  datetime: any;
  min: Date;
  max: Date;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.min = (this.data) ? new Date(this.data.reportedAt.seconds * 1000) : new Date(2019, 12, 31);
    this.max = new Date();
  }

  onSubmitRecovred() {
    if (!this.isDate(this.data.reportedAt)) {
      this.toastrService.error('La date de fin d\'un signalement doit être plus récente que celle de création');
      return ;
    }

    this.data.recovredAt = this.datetime;
    this.data._updatedAt = this.datetime;

    this.reportService.updateReport(this.data).then(
      () => {
        this.toastrService.success('Merci', 'Signalement modifié');
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
