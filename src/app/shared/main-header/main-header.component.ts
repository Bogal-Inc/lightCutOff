import { AuthService } from '@Services/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {ConnectionService} from '@Services/connection.service';

const log = new Logger('main-header.component');

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  appTitle = Const.app.title;
  online: boolean;

  constructor(
    private authService: AuthService,
    private connectionService: ConnectionService,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    // check connection status
    this.connectionService.start();
    this.connectionService.behaviorSubjectObservable$.subscribe(online => {
      const logMessage = (online) ? 'app online' : 'app off line';
      log.debug(logMessage);
      this.online = online;
    });
  }
}
