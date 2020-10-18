import {ReportService} from '@Services/report.service';
import {ToastrService} from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {compareDate} from '@Helpers/date.helper';
import {BaseComponent} from '@Models/baseComponent.model';
import {Report, ReportSatus} from '@Models/report.model';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Component({
  selector: 'app-update-form-report',
  templateUrl: './marker-recovred-report.component.html',
  styleUrls: ['./marker-recovred-report.component.scss']
})
export class MarkerRecovredReportComponent implements OnInit, BaseComponent {
  data: {
    report: null | Report,
    markerCurrentInfoWindow: any
  };
  btnCloseModal = false;
  datetime: any;
  min: Date;
  max: Date;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.min = this.data.report.reportedAt.toDate();
    this.max = new Date();
    this.datetime = this.max;
  }

  onSubmitRecovred() {
    this.analytics.logEvent('recovred_report');
    this.btnCloseModal = true;

    if (!this.isDate(this.data.report.reportedAt)) {
      this.toastrService.error(this.translateService.instant('main.update-form-report.error_date_old'));
      return ;
    }

    this.data.report.recovredAt = this.reportService.fromDate(new Date(this.datetime));
    this.data.report._updatedAt = this.reportService.timestamp;
    this.data.report.status = ReportSatus.CUT_COMPLETED;

    this.reportService.updateReport(this.data.report).then(
      () => {
        this.toastrService.success(
          this.translateService.instant('main.update-form-report.thanks'),
          this.translateService.instant('main.update-form-report.success_recovred'));
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

  closeInfoRecovred() {
    this.data.markerCurrentInfoWindow.close();
  }
}
