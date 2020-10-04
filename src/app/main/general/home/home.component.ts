import {Component, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faPlayCircle, faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('home.component');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly faPlayCircle = faPlayCircle;
  readonly faBullhorn = faBullhorn;
  closeResult = '';
  reports: any;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('home_page');

    this.metaService.initMetatoHome('core.home.title_page');
    this.reports = this.getReportData();
  }

  openModal(content) {
    this.analytics.logEvent('tutorial_video');
    this.modalService.open(content);
  }

  getReportData() {
    if (!localStorage.getItem('reports_count')) {
      return;
    }
    return JSON.parse(localStorage.getItem('reports_count'));
  }
}
