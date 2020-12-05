import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';

const log = new Logger('map-history-stats.component');

@Component({
  selector: 'app-map-menu-stats',
  templateUrl: './map-menu-stats.component.html',
  styleUrls: ['./map-menu-stats.component.scss']
})
export class MapMenuStatsComponent implements OnInit {
  @Input() nbreReportsYear: number;
  @Input() nbreReportsMonthly: number;
  @Input() nbreReportsNotClosed: number;
  @Input() nbreReportsDay: number;
  @Input() nbreReportsDayNotClosed: number;
  now = new Date();
  monthsName = [
    this.translateService.instant('app.january'),
    this.translateService.instant('app.february'),
    this.translateService.instant('app.march'),
    this.translateService.instant('app.april'),
    this.translateService.instant('app.may'),
    this.translateService.instant('app.june'),
    this.translateService.instant('app.july'),
    this.translateService.instant('app.august'),
    this.translateService.instant('app.september'),
    this.translateService.instant('app.october'),
    this.translateService.instant('app.november'),
    this.translateService.instant('app.december'),
  ];

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    log.debug('init');
  }

}
