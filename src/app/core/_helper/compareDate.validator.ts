import { FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


// custom validator to check that two fields match
export function compareDate(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1 > d2){
    return true;
  }

  return false;
}
