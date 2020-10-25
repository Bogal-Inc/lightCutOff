import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {durationToString, getDuration} from '@Helpers/date.helper';
import {faAngleRight, faCircle, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../../core/services-firebase';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {environment} from '../../../../../environments/environment';

const log = new Logger('map-menu.component');

@Component({
  selector: 'app-map-menu',
  templateUrl: './map-menu.component.html',
  styleUrls: ['./map-menu.component.scss']
})
export class MapMenuComponent implements OnInit, OnChanges {
  @Input() reports: Report[];
  @Output() goToMarker: EventEmitter<any> = new EventEmitter<any>();
  readonly isMobile = isMobile();
  readonly faAngleRight = faAngleRight;
  readonly faCircle = faCircle;
  readonly faUser = faUser;
  readonly moduleConfig = environment.app.modules.mapMenu;
  reportsMonthly: Report[];
  reportsNotClosed: Report[];
  reportsDayNotClosed: Report[];
  reportsDay: Report[];
  now: Date;
  showHistory = false;
  active = 1;

  constructor(
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.now = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const reportsCurrent = changes.reports.currentValue;
    const reportsPrevious = changes.reports.previousValue;

    if (reportsCurrent) {
      this.showHistory = true;

      this.reportsMonthly = reportsCurrent.filter(
        report => {
          return report.reportedAt.toDate().getMonth() === this.now.getMonth();
        }
      );

      // the sort is automatic
      this.reportsMonthly.sort(
        (a: any, b: any) => {
          const aDate = a._updatedAt.seconds;
          const bDate = b._updatedAt.seconds;

          if (aDate < bDate) {
            return 1;
          } else if (aDate > bDate) {
            return -1;
          } else {
            return 0;
          }
        });

      this.reportsDay = this.reportsMonthly.filter(
        report => {
          return report.reportedAt.toDate().getDate() === this.now.getDate();
        }
      );

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

  moveToMarker(report: Report, index: number) {
    log.debug('move to marker');
    this.analytics.logEvent('select_content', {
      report,
      where: 'map-history'
    });

    this.changeStyleOnElementHistory(index);
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

  private changeStyleOnElementHistory(index: number) {
    const elements = document.querySelectorAll('.report__nav__item__content__elt');
    elements.forEach(
      element => element.className = 'list-group-item list-group-item-action report__nav__item__content__elt'
    );

    const elementClicked = document.querySelector('#report-item-' + index);
    elementClicked.className = 'list-group-item list-group-item-action report__nav__item__content__elt report__nav__item__content__elt-selected';
  }
}
