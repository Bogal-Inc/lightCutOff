import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';
import {Logger} from '@Services/logger.service';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {METATAG, MetaTag} from '@Models/metaTag.model';

const log = new Logger('report-details-mobile.component');

@Component({
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
      page_location: 'https://lightcutoff.com/report',
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
        new MetaTag(METATAG.KEYWORDS, 'lightcutoff, service information, light cut off, coupure lumiere, electricity services, service d\'electricité, no electricity, pas d\'electricité, lumiere, light, electricity, electricité, Eneo, cameroun, cameroon, energy, energie, fournisseur d’électricité, Electricité cameroun, Particuliers, entreprises, professionnels, industriels, Electricity Cameroon, ménages,'),
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
