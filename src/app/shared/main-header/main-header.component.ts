import { AuthService } from '../../core/services-firebase';
import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {InternetService} from '@Services/internet.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

const log = new Logger('main-header.component');

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() fixedTop = false;
  readonly prod = environment.production;
  readonly moduleEnable = environment.app.modules.ownerReport;
  appTitle = Const.app.title;
  online: boolean;
  mapActive = false;
  adminActive = false;

  constructor(
    private authService: AuthService,
    private connectionService: InternetService,
    private router: Router
  ) { }

  ngOnInit(): void {
    log.debug('init');

    // check connection status
    this.isOnlineStatus();

    // fixed header or not
    const url = this.router.url;
    const route2 = url.split('/')[1];
    if (route2 === '') {
      this.fixedTop = true;
    } else if (route2 === 'map') {
      this.mapActive = true;
    } else if (route2 === 'dashboard' || route2 === 'reports' || route2 === 'statistics_numbers') {
      this.adminActive = true;
    }
  }

  isOnlineStatus() {
    this.connectionService.start();
    this.connectionService.behaviorSubjectObservable$.subscribe(online => {
      const logMessage = (online) ? 'app online' : 'app off line';
      log.debug(logMessage);
      this.online = online;
    });
  }
}
