import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


// TODO: fonction a supprimer
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

export function dayDiff(dateOld, dateNew): number {
  const secondsOld = dateOld.getTime() / 86400000;
  const secondsNew = dateNew.getTime() / 86400000;
  return secondsNew - secondsOld;
}

export function convertSecondsToDate(seconds: number): Date {
  const date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
}
