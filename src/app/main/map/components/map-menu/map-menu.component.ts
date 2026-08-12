import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {OfficialOutage} from '@Models/official-outage.model';
import {OfficialOutageService} from '../../../../core/services-firebase';
import {Logger} from '@Services/logger.service';
import {environment} from '../../../../../environments/environment';
import {faAngleRight, faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {Subscription} from 'rxjs';

const log = new Logger('map-menu.component');

@Component({
  standalone: false,
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
export class MapMenuComponent implements OnInit, OnChanges, OnDestroy {
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
  /** Coupures planifiées officielles (SOCADEL, ex-Eneo) — alimente l'onglet « Programmées ». */
  scheduledOutages: OfficialOutage[] = [];
  now: Date;
  active = 1;
  btnActive = false;
  menuDownUp = isMobile();
  btnSearchBarUpDown = false;
  private scheduledSub?: Subscription;

  constructor(private officialOutageService: OfficialOutageService) { }

  ngOnInit(): void {
    log.debug('init');
    this.now = new Date();
    this.scheduledSub = this.officialOutageService.getUpcoming().subscribe(
      outages => this.scheduledOutages = outages,
      () => log.error('official outages unavailable')
    );
  }

  ngOnDestroy(): void {
    this.scheduledSub?.unsubscribe();
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
      report => report.status === ReportSatus.ONGOING
    );

    this.reportsDayNotClosed = this.reportsDay.filter(
      report => report.status === ReportSatus.ONGOING
    );
  }

  /**
   * @description: sort by update date
   */
  private sortMarkersTab(){
    // the sort by update date
    this.reportsMonthly.sort(
      (a: any, b: any) => {
        const aDate = a?.updatedAt?.seconds;
        const bDate = b?.updatedAt?.seconds;

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
