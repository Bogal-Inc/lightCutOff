import { AuthService } from '../../core/services-firebase/auth.service';
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
  appTitle = Const.app.title;
  online: boolean;

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
    if (url.split('/')[1] === '') {
      this.fixedTop = true;
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
