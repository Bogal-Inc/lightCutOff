import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';

const log = new Logger('about-us.component');

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  projectTitle = Const.app.title;

  constructor(
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.metaService.initMetatoAboutUs('core.aboutus.title_page');
  }

}
