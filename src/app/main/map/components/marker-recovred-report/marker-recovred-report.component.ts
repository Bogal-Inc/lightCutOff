import {ReportService} from '@Services/report.service';
import {ToastrService} from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {compareDate} from '@Helpers/date.helper';
import {BaseComponent} from '@Models/baseComponent.model';
import {Report, ReportSatus} from '@Models/report.model';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './marker-recovred-report.component.html',
  styleUrls: ['./marker-recovred-report.component.scss']
})
export class MarkerRecovredReportComponent implements OnInit, BaseComponent {
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
    this.datetime = this.max;
  }

  onSubmitRecovred() {
    if (!this.isDate(this.data.reportedAt)) {
      this.toastrService.error('La date de fin d\'un signalement doit être plus récente que celle de création');
      return ;
    }

    this.data.recovredAt = this.datetime;
    this.data._updatedAt = this.datetime;
    this.data.status = ReportSatus.RECOVRED;

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
