import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {durationToString, getDuration} from '@Helpers/date.helper';
import {faAngleRight, faCircle, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../../core/services-firebase/auth.service';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Const} from '../../../../../environments/const';
import {environment} from '../../../../../environments/environment';

const log = new Logger('map-history-marker.component');

@Component({
  selector: 'app-map-history-marker',
  templateUrl: './map-history-marker.component.html',
  styleUrls: ['./map-history-marker.component.scss']
})
export class MapHistoryMarkerComponent implements OnInit, OnChanges {
  @Input() reports: Report[];
  @Output() goToMarker: EventEmitter<any> = new EventEmitter<any>();
  readonly isMobile = isMobile();
  readonly faAngleRight = faAngleRight;
  readonly faCircle = faCircle;
  readonly faUser = faUser;
  readonly moduleConfig = environment.app.modules.mapMenu;
  reportsMonthly: Report[];
  reportsNotClosed: Report[];
  now: Date;
  showHistory = false;
  active = 1;
  reportsDay: Report[];
  reportsDayNotClosed: Report[];

  constructor(
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.now = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const reportsTmp = changes.reports.currentValue;

    if (reportsTmp) {
      this.showHistory = true;
      this.reportsMonthly = reportsTmp.filter(
        report => {
          return report.reportedAt.toDate().getMonth() === this.now.getMonth();
        }
      );
      this.reportsDay = this.reportsMonthly.filter(
        report => {
          return report.reportedAt.toDate().getDate() === this.now.getDate();
        }
      );
      // the sort is automatic
      // this.reportsMonthly.sort(
      //   (a: any, b: any) => {
      //     const aDate = a._updatedAt.seconds;
      //     const bDate = b._updatedAt.seconds;
      //
      //     if (aDate < bDate) {
      //       return 1;
      //     } else if (aDate > bDate) {
      //       return -1;
      //     } else {
      //       return 0;
      //     }
      //   }
      // );
      this.reportsNotClosed = this.reportsMonthly.filter(
        report => report.status === ReportSatus.CUT
      );

      this.reportsDayNotClosed = this.reportsDay.filter(
        report => report.status === ReportSatus.CUT
      );
    }
  }

  isClosed(report) {
    return report.status === ReportSatus.CUT_COMPLETED;
  }

  moveToMarker(report) {
    log.debug('move to marker');
    this.analytics.logEvent('select_content', {
      report,
      where: 'map-history'
    });

    this.goToMarker.emit(report);
  }

  reportDurationToString(report: Report) {
    const duration = (report.recovredAt) ?
      getDuration(report.reportedAt.toDate(), report.recovredAt.toDate()) :
      getDuration(report.reportedAt.toDate(), new Date());
    let result = (report.recovredAt) ? 'Coupé pendant ' : 'Coupé depuis ';

    return result += durationToString(duration);
  }

  isOwner(report: Report) {
    return this.authService.getUser().id === report._createdBy.id;
  }
}
