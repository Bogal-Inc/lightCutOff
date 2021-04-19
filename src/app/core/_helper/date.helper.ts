import {Duration} from '@Models/report.model';
import * as firebase from 'firebase/app';


// custom validator to check that two fields match
export function compareDate(date1: Date, date2: Date): boolean {
  return date1 > date2;
}

export function fromDate(date: Date): firebase.default.firestore.Timestamp {
  return firebase.default.firestore.Timestamp.fromDate(date);
}

export function getDuration(date1, date2){
  const diff = {
    day: undefined,
    hour: undefined,
    min: undefined,
    sec: undefined
  };                           // Initialisation du retour
  let tmp = date2 - date1;

  tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
  diff.sec = tmp % 60;                    // Extraction du nombre de secondes

  tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
  diff.min = tmp % 60;                    // Extraction du nombre de minutes

  tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
  diff.hour = tmp % 24;                   // Extraction du nombre d'heures

  tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
  diff.day = tmp;

  return diff;
}

export function durationToString(duration: Duration): string {
  let result = '';

  if (duration.day === 0) {
    if (duration.hour === 0) {
      if (duration.min === 0) {
        result += 'Il y a quelques secondes';
      } else {
        result += duration.min + 'm';
      }
    } else {
      if (duration.hour === 1) {
        result += duration.hour + 'h ' + duration.min + 'm';
      } else {
        result += duration.hour + 'h';
      }
    }
  } else {
    if (duration.day === 1) {
      result += duration.day + 'j ' + duration.hour + 'h';
    } else {
      result += duration.day + 'j';
    }
  }

  return result;
}
