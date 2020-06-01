import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function ngbToDate(ngbDate?: NgbDateStruct, ngbHours?: any): Date {
  let jsDate = null;

  if (ngbDate) {
    jsDate = new Date(
      ngbDate.year,
      ngbDate.month - 1,
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

  return jsDate.toISOString();
}


// export function fromModel(ts: firestore.Timestamp): NgbDateStruct {
//   if (ts instanceof firestore.Timestamp) {
//     return {
//       year: ts.toDate().getFullYear(),
//       month: ts.toDate().getMonth() + 1,
//       day: ts.toDate().getDate()
//     };
//   } else { return null; }
// }
