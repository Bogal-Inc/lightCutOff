import { Component, OnInit } from '@angular/core';
import {Const} from '../../../../environments/const';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';

const log = new Logger('maintenance.component');

@Component({
  standalone: false,
  selector: 'app-page-maintenance',
  templateUrl: './page-maintenance.component.html',
  styleUrls: ['./page-maintenance.component.scss']
})
export class PageMaintenanceComponent implements OnInit {
  appTitle = Const.app.title;

  constructor(private analytics: AngularFireAnalytics) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka-prod.web.app/',
      page_path: '/',
      page_title: 'Maintenance'
    });
  }

}
