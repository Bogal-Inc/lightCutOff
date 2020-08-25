import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '@Services/report.service';
import {Report} from '@Models/report.model';
import {Logger} from '@Services/logger.service';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    log.debug('init');

    if (!isMobile()) {
      this.router.navigate(['/reports']);
    }

    this.metaService.initMetatoAboutUs('report.report-details-mobile.title_page');
    this.getReport();
  }

  getReport(){
    const reportId = this.actiavteRoute.snapshot.queryParamMap.get('id');
    this.reportService.getReport(reportId).subscribe(
      data => this.report = data,
      err => log.error('report not found', err)
    );
  }

}
