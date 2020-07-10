import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';


@Pipe({
  name: 'timestamp'
})
export class TimestampPipe extends DatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): any {
    registerLocaleData(localeFr, 'fr');
    return super.transform(+value * 1000, 'medium').toLocaleString();
  }

}
