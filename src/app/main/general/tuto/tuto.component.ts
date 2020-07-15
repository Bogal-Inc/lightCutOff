import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import {Logger} from '@Services/logger.service';

const log = new Logger('tuto.component');

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss']
})
export class TutoComponent implements OnInit {
  projectTitle = Const.app.title;

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

}
