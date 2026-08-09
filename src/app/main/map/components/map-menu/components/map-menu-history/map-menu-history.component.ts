import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Report, ReportSatus, reportServiceType} from '@Models/report.model';
import {durationToString, getDuration} from '@Helpers/date.helper';
import {AuthService} from '../../../../../../core/services-firebase';
import {Logger} from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {faAngleRight, faCircle, faUser} from '@fortawesome/free-solid-svg-icons';

const log = new Logger('map-menu-history.component');

@Component({
  standalone: false,
  selector: 'app-map-menu-history',
  templateUrl: './map-menu-history.component.html',
  styleUrls: ['./map-menu-history.component.scss']
})
export class MapMenuHistoryComponent implements OnInit {
  @Output() goToMarker: EventEmitter<any> = new EventEmitter<any>();
  @Input() reports: Report[];
  readonly faAngleRight = faAngleRight;
  readonly faCircle = faCircle;
  readonly faUser = faUser;

  constructor(
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
    private translateService: TranslateService,
  ) { }

  serviceType(report: Report): string {
    return reportServiceType(report);
  }

  ngOnInit(): void {
  }

  isClosed(report) {
    return report.status === ReportSatus.RESOLVED;
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
    const duration = (report.resolvedAt) ?
      getDuration(report.reportedAt.toDate(), report.resolvedAt.toDate()) :
      getDuration(report.reportedAt.toDate(), new Date());
    const result = this.translateService.instant(
      (report.resolvedAt) ? 'main.map-history-marker.cut_during' : 'main.map-history-marker.cut_since');

    return result + durationToString(duration);
  }

  isOwner(report: Report) {
    return false; // lecture seule : pas de notion de propriétaire côté site
  }

  private changeStyleOnElementHistory(index: number) {
    const elements = document.querySelectorAll('.reports__history__item');
    const elementClicked = document.querySelector('#report-item-' + index);

    elements.forEach(
      element => {
        if (element.className.indexOf('reports__history__item-close') > 0) {
          element.className = 'list-group-item list-group-item-action reports__history__item-close reports__history__item';
        } else {
          element.className = 'list-group-item list-group-item-action reports__history__item';
        }
      }
    );
    elementClicked.className = 'list-group-item list-group-item-action reports__history__item reports__history__item-selected';
  }

}
