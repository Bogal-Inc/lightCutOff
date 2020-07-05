import { Injectable } from '@angular/core';
import {BehaviorSubject, fromEvent, merge, Observable, of} from 'rxjs';
import {mapTo} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private behaviorSubject$;
  behaviorSubjectObservable$: Observable<boolean>;

  constructor() { }

  start() {
    this.initSubjects();
    this.behaviorSubject$.next();
  }

  initSubjects() {
    this.behaviorSubject$ = new BehaviorSubject(true);
    this.behaviorSubjectObservable$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
  }
}
