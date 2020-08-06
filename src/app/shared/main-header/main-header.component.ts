import { AuthService } from '@Services/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {ConnectionService} from '@Services/connection.service';
import {Router} from '@angular/router';

const log = new Logger('main-header.component');

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  appTitle = Const.app.title;
  online: boolean;
  fixedTop = false;

  constructor(
    private authService: AuthService,
    private connectionService: ConnectionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    log.debug('init');

    // check connection status
    this.isOnlineStatus();

    // fixed header or not
    const url = this.router.url;
    this.fixedTop = (url.split('/')[1] === '') || (url.split('/')[1] === 'dashboard');
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
