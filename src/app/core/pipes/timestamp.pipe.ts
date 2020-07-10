import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {I18nService} from '@Services/i18n.service';


@Pipe({
  name: 'timestamp'
})
export class TimestampPipe extends DatePipe implements PipeTransform {

  constructor(
    private i18nService: I18nService
  ) {
    super(i18nService.language);
  }

  transform(value: unknown, ...args: unknown[]): any {
    registerLocaleData(localeFr, this.i18nService.language);
    return super.transform(+value * 1000, 'medium');
  }

}
