import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';
import {MetaService} from '@Services/meta.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

const log = new Logger('tuto.component');

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss']
})
export class TutoComponent implements OnInit {
  projectTitle = Const.app.title;
  faInfoCircle = faInfoCircle;

  constructor(
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.metaService.initMetatoTuto('core.tuto.title_page');
  }

}
