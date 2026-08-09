import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {Router} from '@angular/router';
import {SectionSpyService} from '@Services/section-spy.service';
import {I18nService} from '@Services/i18n.service';
import {environment} from '../../../environments/environment';

const log = new Logger('main-header.component');

@Component({
  standalone: false,
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() fixedTop = false;
  @Input() isGlobalMessage = false;
  readonly isModuleAdmin = environment.app.modules.admin;
  readonly appTitle = Const.app.title;
  /** Ancres des sections de l'accueil (clés i18n core.home.nav). */
  readonly sectionLinks = [
    { fragment: 'about', label: 'about' },
    { fragment: 'figures', label: 'figures' },
    { fragment: 'why', label: 'why' },
    { fragment: 'app', label: 'app' },
    { fragment: 'map', label: 'map' },
    { fragment: 'awards', label: 'awards' }
  ];

  mapActive = false;
  adminActive = false;
  activeSection: string | null = null;
  currentLang: string;

  constructor(
    private router: Router,
    private sectionSpy: SectionSpyService,
    private i18nService: I18nService,
  ) {}

  ngOnInit(): void {
    log.debug('init');
    this.activeMenuDashboard();
    this.sectionSpy.activeSection$.subscribe(section => this.activeSection = section);
    this.currentLang = this.i18nService.language;
  }

  setLang(lang: string) {
    if (this.i18nService.language !== lang) {
      this.i18nService.language = lang;
    }
    this.currentLang = lang;
  }

  private activeMenuDashboard() {
    // fixed header or not
    const url = this.router.url;
    const route2 = url.split('/')[1];
    this.adminActive = route2 === 'admin';
  }
}
