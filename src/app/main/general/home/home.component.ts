import { Component, OnInit } from '@angular/core';
import {Logger} from '@Services/logger.service';
import {faPlay} from '@fortawesome/free-solid-svg-icons';

const log = new Logger('home.component');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  faPlay = faPlay;
  showVideo = false;

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

  toggleVideo() {
    this.showVideo = (!this.showVideo);
  }


}
