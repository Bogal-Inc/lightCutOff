import { AuthService } from '../../core/services-firebase';
import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';

const log = new Logger('main-header.component');

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() fixedTop = false;
  @Input() isGlobalMessage = false;
  readonly faUserCircle = faUserCircle;
  readonly isAdmin = environment.app.modules.admin;
  readonly moduleEnable = environment.app.modules.ownerReport;
  appTitle = Const.app.title;
  mapActive = false;
  adminActive = false;
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    log.debug('init');
    this.activeMenuDashboard();
    this.user = this.authService.getUserLogged();
  }

  private activeMenuDashboard() {
    // fixed header or not
    const url = this.router.url;
    const route2 = url.split('/')[1];

    if (route2 === 'admin') {
      this.adminActive = true;
    } else {
      this.adminActive = false;
    }
  }

  logout() {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/']);
  }
}
