import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@Services/logger.service';

const log = new Logger('loading.component');

@Component({
  standalone: false,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() show: boolean;

  constructor() {}

  ngOnInit(): void {
    log.debug('init');
  }

}
