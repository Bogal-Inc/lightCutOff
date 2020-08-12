import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('about-us.component');

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  projectTitle = Const.app.title;

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.titleService.setTitle(
      this.projectTitle + ' - ' + this.translateService.instant('general.aboutus.title_page')
    );
  }

}
