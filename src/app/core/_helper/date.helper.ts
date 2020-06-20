import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function ngbToDate(ngbDate?: NgbDateStruct, ngbHours?: any): Date {
  let jsDate = null;

  if (ngbDate) {
    jsDate = Date.UTC(
      ngbDate.year,
      ngbDate.month - 1,
      ngbDate.day,
      ngbHours.hour,
      ngbHours.minute
    );
  } else {
    const now = new Date();
    jsDate = Date.UTC(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }

  return new Date(jsDate);
}

// custom validator to check that two fields match
export function compareDate(date1: Date, date2: Date): boolean {

  if (date1 > date2){
    return true;
  }

  return false;
}
