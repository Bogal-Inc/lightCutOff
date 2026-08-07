import {Component, Input, OnInit} from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import {Router} from '@angular/router';
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

  mapActive = false;
  adminActive = false;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    log.debug('init');
    this.activeMenuDashboard();
  }

  private activeMenuDashboard() {
    // fixed header or not
    const url = this.router.url;
    const route2 = url.split('/')[1];
    this.adminActive = route2 === 'admin';
  }
}
