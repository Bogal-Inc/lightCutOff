import {Component, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faPlay, faMapMarker} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { Const } from 'src/environments/const';
import {TranslateService} from '@ngx-translate/core';
import {MetaService} from '@Services/meta.service';

const log = new Logger('home.component');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  projectTitle = Const.app.title;
  faPlay = faPlay;
  faMapMarker = faMapMarker;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private metaService: MetaService,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');

    this.metaService.initMetatoHome('core.home.title_page');
  }

  openModal(content) {
    this.modalService.open(content);
  }


}
