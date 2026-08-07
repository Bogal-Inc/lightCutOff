import {Component, HostListener, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {AuthService, ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {MetaTag, METATAG} from '@Models/metaTag.model';

const log = new Logger('home.component');

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly playStoreUrl = Const.app.playStoreUrl;
  readonly appStoreUrl = Const.app.appStoreUrl;
  /** Sections de la page pour la navigation par points (id d'ancre + clé i18n courte). */
  readonly sections = [
    { id: 'hero', label: 'hero' },
    { id: 'about', label: 'about' },
    { id: 'figures', label: 'figures' },
    { id: 'why', label: 'why' },
    { id: 'app', label: 'app' },
    { id: 'awards', label: 'awards' },
    { id: 'map', label: 'map' },
    { id: 'contactus', label: 'contact' }
  ];
  activeSection = 'hero';
  readonly faBullhorn = faBullhorn;
  closeResult = '';
  reports: any;
  reportsCurrentYear: any;
  reportsCurrentMonth: any;
  reportsCurrentDay: Report[];
  nbrReportsDay: number;
  nbrReportsMonthly: number;
  isMobil: boolean;
  isMarkerAdded: boolean;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics,
    private reportService: ReportService,
    private authService: AuthService,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://njuka.app',
      page_path: '/',
      page_title: 'Home'
    });

    this.isMobil = isMobile();
    // this.metaService.initMetatoHome('core.home.title_page');
    // this.loadReports();
    this.metaService.setTagsGeneral(
      this.translateService.instant('core.home.title_page'),
      [
      new MetaTag(METATAG.KEYWORDS, 'njuka, coupure electricité, coupure eau, délestage, Eneo, Camwater, Cameroun, Cameroon, signaler coupure, panne de courant, coupures programmées, power outage, water outage, carte des coupures'),
      new MetaTag(METATAG.DESCRIPTION, this.translateService.instant('core.home.desc_page'))
    ]);
  }

  private loadReports() {
    this.reportService.getReports({
    }).subscribe(
      (reports) => {
        this.reports = reports;

        this.isMarkerAdded = this.isCurrentUSerHaveMarkers();
        this.initReportsCollection();
      });
  }



  private isCurrentUSerHaveMarkers() {
    return this.reports.find(
      report => false
    );
  }

  private initReportsCollection() {
    const now = new Date();

    this.reportsCurrentYear = this.reports.filter(
      report => report.reportedAt.toDate().getFullYear() === now.getFullYear()
    );

    this.reportsCurrentMonth = this.reportsCurrentYear.filter(
      report => report.reportedAt.toDate().getMonth() === now.getMonth()
    );

    this.reportsCurrentDay = this.reportsCurrentMonth.filter(
      report => report.reportedAt.toDate().getDate() === now.getDate()
    );
    this.nbrReportsMonthly = this.reportsCurrentMonth.length;
    this.nbrReportsDay = this.reportsCurrentDay.length;
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const probe = window.scrollY + window.innerHeight / 3;
    for (const section of this.sections) {
      const elt = document.getElementById(section.id);
      if (elt && probe >= elt.offsetTop && probe < elt.offsetTop + elt.offsetHeight) {
        this.activeSection = section.id;
        return;
      }
    }
  }
}
