import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('tuto.component');

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss']
})
export class TutoComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly faInfoCircle = faInfoCircle;

  constructor(
    private metaService: MetaService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('tutorial_page');

    this.metaService.initMetatoTuto('core.tuto.title_page');
  }

}
