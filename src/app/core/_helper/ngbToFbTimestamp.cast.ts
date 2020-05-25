import { firestore } from 'firebase';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function ngbToFbTimestamp(ngbDate?: NgbDateStruct, ngbHours?: any): firestore.Timestamp {
  let jsDate = null;

  if (ngbDate) {
    jsDate = new Date(
      ngbDate.year,
      ngbDate.month,
      ngbDate.day,
      ngbHours.hour,
      ngbHours.minute
    );
  } else {
    const now = new Date();
    jsDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }

  return firestore.Timestamp.fromDate(jsDate);
}


export function fromModel(ts: firestore.Timestamp): NgbDateStruct {
  if (ts instanceof firestore.Timestamp) {
    return {
      year: ts.toDate().getFullYear(),
      month: ts.toDate().getMonth() + 1,
      day: ts.toDate().getDate()
    };
  } else { return null; }
}
