import {Component, Input, OnInit} from '@angular/core';
import {ReportService} from '../../../../core/services-firebase/report.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {ReportSatus} from '@Models/report.model';
import {compareDate} from '@Helpers/date.helper';

@Component({
  standalone: false,
  selector: 'app-own-report-detail',
  templateUrl: './own-report-detail.component.html',
  styleUrls: ['./own-report-detail.component.scss']
})
export class OwnReportDetailComponent implements OnInit {
  @Input() report;
  readonly faEdit = faEdit;
  max: Date;
  datetime: Date;
  min: Date;
  showFormRecovred = false;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.min = (this.report) ?
      new Date(this.report.reportedAt.seconds * 1000) :
      new Date(2019, 12, 31);
    this.max = new Date();
    this.datetime = this.max;
  }

  editRecovred() {
    this.showFormRecovred = !this.showFormRecovred;
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

  onSubmitRecovred() {
    this.analytics.logEvent('recovred_report');

    if (!this.isDate(this.report.reportedAt)) {
      this.toastrService.error(this.translateService.instant('main.update-form-report.error_date_old'));
      return ;
    }

    this.report.recovredAt = this.reportService.fromDate(this.datetime);
    this.report._updatedAt = this.reportService.timestamp;
    this.report.status = ReportSatus.CUT_COMPLETED;

    this.reportService.updateReport(this.report).then(
      () => {
        this.toastrService.success(
          this.translateService.instant('main.update-form-report.thanks'),
          this.translateService.instant('main.update-form-report.success_recovred'));
      }
    );
  }
}
