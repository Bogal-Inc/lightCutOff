import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Logger} from '@Services/logger.service';
import {environment} from '../../../../../environments/environment';
import {faAngleRight, faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';

const log = new Logger('map-menu.component');

@Component({
  selector: 'app-map-menu',
  templateUrl: './map-menu.component.html',
  styleUrls: ['./map-menu.component.scss'],
  animations: [
    trigger('searchBarUpDown', [
      state('left', style({
        transform: 'translateX(-85%)'
      })),
      state('right', style({
        transform: 'translateX(0%)'
      })),
      transition('right => left', [
        animate('0.5s')
      ]),
      transition('left => right', [
        animate('0.5s')
      ]),
    ]),
    trigger('btnSearchBarUpDown', [
      state('left', style({
        transform: 'translateX(-1%)'
      })),
      state('right', style({
        transform: 'translateX(0%)'
      })),
      transition('left => right', [
        animate('0.5s')
      ]),
      transition('right => left', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class MapMenuComponent implements OnInit, OnChanges {
  @Output() goToMarkerEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() researchPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterMarker: EventEmitter<any> = new EventEmitter<any>();
  @Input() reports: Report[];
  readonly mapMenu = environment.app.modules.mapMenu;
  readonly faAngleRight = faAngleRight;
  readonly faAngleLeft = faAngleLeft;
  reportsSort: Report[];
  reportsMonthly: Report[];
  reportsNotClosed: Report[];
  reportsDayNotClosed: Report[];
  reportsDay: Report[];
  now: Date;
  active = 1;
  btnActive = false;
  menuDownUp = false;
  btnSearchBarUpDown = false;

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
    this.now = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const reportsCurrent = changes.reports.currentValue;

    if (reportsCurrent) {
      this.loadReports(reportsCurrent);
    }
  }

  onToggleMenu() {
    this.menuDownUp = !this.menuDownUp;
    this.btnSearchBarUpDown = !this.btnSearchBarUpDown;
    this.btnActive = !this.btnActive;
  }

  goToMarker(event: any) {
    this.goToMarkerEnd.emit(event);
  }

  onSearchPlace(event: any) {
    this.researchPlace.emit(event);
  }

  onMapFiltered(event) {
    this.filterMarker.emit(event);
  }

  private loadReports(reportsCurrent: Report[]) {
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

  /**
   * @description: sort by update date
   */
  private sortMarkersTab(){
    // the sort by update date
    this.reportsMonthly.sort(
      (a: any, b: any) => {
        const aDate = a?._updatedAt?.seconds;
        const bDate = b?._updatedAt?.seconds;

        if (aDate < bDate) {
          return 1;
        } else if (aDate > bDate) {
          return -1;
        } else {
          return 0;
        }
      });
  }
}
