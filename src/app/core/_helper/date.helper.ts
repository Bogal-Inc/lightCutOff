import * as firebase from 'firebase/app';


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

export function fromDate(date: Date): firebase.firestore.Timestamp {
  return firebase.firestore.Timestamp.fromDate(date);
}
