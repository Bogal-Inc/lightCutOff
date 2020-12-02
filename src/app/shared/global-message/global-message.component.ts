import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss']
})
export class GlobalMessageComponent implements OnInit {
  @Input() options: {
    active: false,
    type: 'danger',
    message: string
  };

  constructor() { }

  ngOnInit(): void {
  }

  getStyle() {
    return;
  }
}
