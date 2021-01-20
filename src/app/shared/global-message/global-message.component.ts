import {Component, Input, OnInit} from '@angular/core';
import {I18nService} from '@Services/i18n.service';
import {Const} from '../../../environments/const';
import {InternetService} from '@Services/internet.service';

@Component({
  selector: 'app-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss']
})
export class GlobalMessageComponent implements OnInit {
  @Input() fixedTop = false;
  @Input() options: {
    type: 'danger',
    message_en: string,
    message_fr: string,
  };
  langFr: boolean;

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.langFr = this.i18nService.language === Const.app.lang.fr;
  }

  isMessage(): boolean {
    return this.options?.message_fr !== '';
  }
}
