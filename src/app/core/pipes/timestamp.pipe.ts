import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe extends DatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): any {
    return super.transform(+value * 1000, 'd MMMM y h:mm a');
  }

}
