import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss']
})
export class GlobalMessageComponent implements OnInit {
  @Input() options: {
    type: 'danger',
    message: string
  };

  constructor() { }

  ngOnInit(): void {
  }

  isMessage(): boolean {
    return this.options?.message !== '';
  }
}
