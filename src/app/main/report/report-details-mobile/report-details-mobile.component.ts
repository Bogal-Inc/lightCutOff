import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';
import {Logger} from '@Services/logger.service';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';

const log = new Logger('report-details-mobile.component');

@Component({
  standalone: false,
  selector: 'app-report-details-mobile',
  templateUrl: './report-details-mobile.component.html',
  styleUrls: ['./report-details-mobile.component.scss']
})
export class ReportDetailsMobileComponent implements OnInit {
  report: Report;
  readonly projectTitle = Const.app.title;

  constructor(
    private actiavteRoute: ActivatedRoute,
    private reportService: ReportService,
    private translateService: TranslateService,
    private metaService: MetaService,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka.app/report',
      page_path: '/report',
      page_title: 'Report details',
      mobile: true
    });

    if (!isMobile()) {
      this.router.navigate(['/reports']);
    }

    this.metaService.setTagsGeneral(
      this.translateService.instant('report.report-details-mobile.title_page'),
      [
        new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, SOCADEL, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
        new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('report.report-details-mobile.title_page'))
      ]);

    this.getReport();
  }

  getReport(){
    const reportId = this.actiavteRoute.snapshot.queryParamMap.get('id');
    this.reportService.getReport(reportId).subscribe(
      report => this.report = report,
      err => log.error('report not found', err)
    );
  }

}
