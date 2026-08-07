import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '@Services/logger.service';

const log = new Logger('tutorial.component');

@Component({
  standalone: false,
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    log.debug('init');
  }

}
