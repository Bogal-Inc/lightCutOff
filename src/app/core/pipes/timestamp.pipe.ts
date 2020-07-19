import { Pipe, PipeTransform } from '@angular/core';
import {I18nService} from '@Services/i18n.service';


@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  constructor(
    private i18nService: I18nService
  ) {}

  transform(value: unknown, ...args: unknown[]): any {
    const dateFormat = new Intl.DateTimeFormat(
      this.i18nService.language,
      {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

    // @ts-ignore
    return dateFormat.format(value);
  }

}
