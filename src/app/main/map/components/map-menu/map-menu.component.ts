import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Logger} from '@Services/logger.service';
import {environment} from '../../../../../environments/environment';
import {isMobile} from '@Helpers/mobile-confirm.helper';

const log = new Logger('map-menu.component');

@Component({
  selector: 'app-map-menu',
  templateUrl: './map-menu.component.html',
  styleUrls: ['./map-menu.component.scss']
})
export class MapMenuComponent implements OnInit, OnChanges {
  @Output() goToMarkerEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() researchPlace: EventEmitter<any> = new EventEmitter<any>();
  @Input() reports: Report[];
  readonly moduleConfig = environment.app.modules.mapMenu;
  reportsSort: Report[];
  reportsMonthly: Report[];
  reportsNotClosed: Report[];
  reportsDayNotClosed: Report[];
  reportsDay: Report[];
  now: Date;
  showHistory = false;
  active = 1;

  constructor() { }

  ngOnInit(): void {
    log.debug('init');

    this.now = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const reportsCurrent = changes.reports.currentValue;
    const reportsPrevious = changes.reports.previousValue;

    if (reportsCurrent) {
      this.loadReports(reportsCurrent);
    }
  }

  goToMarker(event: any) {
    this.goToMarkerEnd.emit(event);
  }

  onSearchPlace(event: any) {
    this.researchPlace.emit(event);
  }

  private sortMarkersTab(){
    // the sort by update date
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
  }

  private loadReports(reportsCurrent: Report[]) {
    this.showHistory = true;

    this.reportsMonthly = reportsCurrent.filter(
      report => {
        return report.reportedAt.toDate().getMonth() === this.now.getMonth();
      }
    );

    // sort reportsMonthly by recovred date
    this.sortMarkersTab();

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
