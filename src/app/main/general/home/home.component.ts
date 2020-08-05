import {Component, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('home.component');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {
  faPlay = faPlay;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.centered = true;
    config.size = 'lg';
  }

  ngOnInit(): void {
    log.debug('init');
  }

  openModal(content) {
    this.modalService.open(content);
  }
}
