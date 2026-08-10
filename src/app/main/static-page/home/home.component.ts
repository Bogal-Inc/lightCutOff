import {AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {AuthService, ReportService} from '../../../core/services-firebase';
import {Report} from '@Models/report.model';
import {isMobile} from '@Helpers/mobile-confirm.helper';
import {MetaTag, METATAG} from '@Models/metaTag.model';
import {SectionSpyService} from '@Services/section-spy.service';

const log = new Logger('home.component');

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
    { id: 'map', label: 'map' },
    { id: 'awards', label: 'awards' }
  ];
  activeSection = 'hero';
  /** Tuiles « le problème en chiffres » : compteurs animés à l'apparition de la section. */
  readonly figures: {
    target: number; decimals: number; display: string; prefix: string; suffix: string;
    color: 'amber' | 'sky'; labelKey: string;
  }[] = [
    { target: 34, decimals: 0, display: '0', prefix: '', suffix: ' %', color: 'amber', labelKey: 'reliability_label' },
    { target: 10.4, decimals: 1, display: '0', prefix: '', suffix: '', color: 'amber', labelKey: 'outages_label' },
    { target: 82, decimals: 0, display: '0', prefix: '', suffix: ' %', color: 'sky', labelKey: 'water_label' }
  ];
  figuresAnimated = false;
  private figuresObserver?: IntersectionObserver;
  readonly faMapMarkedAlt = faMapMarkedAlt;
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
    private ngZone: NgZone,
    private sectionSpy: SectionSpyService,
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
    this.sectionSpy.setActiveSection('hero');
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
    // en bas de page, la dernière section est active même si son haut
    // ne peut pas atteindre le header (sections courtes en fin de page)
    const scrollBottom = window.scrollY + window.innerHeight;
    if (scrollBottom >= document.documentElement.scrollHeight - 2) {
      this.setActiveSection(this.sections[this.sections.length - 1].id);
      return;
    }

    // sinon : dernière section dont le haut est passé sous le header collant
    const probe = window.scrollY + 96;
    let current = this.sections[0].id;
    for (const section of this.sections) {
      const elt = document.getElementById(section.id);
      if (elt && elt.getBoundingClientRect().top + window.scrollY <= probe) {
        current = section.id;
      }
    }
    this.setActiveSection(current);
  }

  private setActiveSection(sectionId: string) {
    this.activeSection = sectionId;
    this.sectionSpy.setActiveSection(sectionId);
  }

  ngAfterViewInit(): void {
    const section = document.getElementById('figures');
    if (!section || typeof IntersectionObserver === 'undefined') {
      this.startFiguresAnimation();
      return;
    }

    this.figuresObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        this.figuresObserver.disconnect();
        this.startFiguresAnimation();
      }
    }, { threshold: 0.35 });
    this.figuresObserver.observe(section);
  }

  /** Compte de 0 à la valeur cible avec une décélération douce (easeOutCubic). */
  private startFiguresAnimation() {
    if (this.figuresAnimated) {
      return;
    }
    this.figuresAnimated = true;

    const durationMs = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.ngZone.run(() => {
        const decimalSeparator = this.translateService.currentLang?.startsWith('fr') ? ',' : '.';
        for (const figure of this.figures) {
          figure.display = (figure.target * eased).toFixed(figure.decimals).replace('.', decimalSeparator);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    this.ngZone.runOutsideAngular(() => requestAnimationFrame(tick));
  }

  ngOnDestroy(): void {
    this.figuresObserver?.disconnect();
    this.sectionSpy.setActiveSection(null);
  }
}
