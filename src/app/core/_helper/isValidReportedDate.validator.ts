import { FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


// custom validator to check that two fields match
export function isValidReportedDate(reportedAt: string, restoredAt: string, reportedHour: string, restoredHour: string) {

  return (formGroup: FormGroup) => {
    const reportedAtControl = formGroup.controls[reportedAt];
    const restoredAtControl = formGroup.controls[restoredAt];
    const reportedHourControl = formGroup.controls[reportedHour];
    const restoredHourControl = formGroup.controls[restoredHour];

    console.log('1', reportedAtControl.errors)
    console.log('2', restoredAtControl.errors)
    console.log('3', reportedHourControl.errors)
    console.log('4', restoredHourControl.errors)

    if (reportedAtControl.errors && restoredAtControl.errors && reportedHourControl.errors && restoredHourControl.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    const reportedDate: Date = ngbtoDate(reportedAtControl.value, reportedHourControl.value);
    const restoredDate: Date = ngbtoDate(restoredAtControl.value, restoredHourControl.value);
    // console.log('hour', reportedDate)
    // console.log('hour', restoredDate)

    // const reportedDate: NgbDate = new NgbDate(reportedAtControl.value.year, reportedAtControl.value.month, reportedAtControl.value.day);
    // const restoredDate: NgbDate = new NgbDate(restoredAtControl.value.year, restoredAtControl.value.month, restoredAtControl.value.day);

    // set error on matchingControl if validation fails
    if (restoredDate > reportedDate) {
      reportedAtControl.setErrors({ compareDate: true });
    } else {
      reportedAtControl.setErrors(null);
    }
  };
}

export function ngbtoDate(ngbDate: NgbDateStruct, ngbHours?: any) {
  return new Date(
    ngbDate.year,
    ngbDate.month,
    ngbDate.day,
    ngbHours.hour,
    ngbHours.minute
  );
}
