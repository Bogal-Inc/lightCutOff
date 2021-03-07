import {SimpleUser, User} from '@Models/user.model';
import { Const } from 'src/environments/const';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService{

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore
  ) {
    super(angularFireAuth, angularFirestore);
  }

  anonymousAuth() {
    this.angularFireAuth.signInAnonymously().catch(err => {
      const errorCode = err.code;
      const errorMessage = err.message ;
    });
  }

  getAnonymousUser() {
    this.angularFireAuth.onAuthStateChanged(user => {
      if (user) {
        const currentUser = { id: user.uid } as SimpleUser;
        localStorage.setItem(Const.user.localstorage, JSON.stringify(currentUser));
      }
    });
  }

  getUserToLocalStorage() {
    return JSON.parse(localStorage.getItem(Const.user.localstorage));
  }

  createUserToLocalStorage(user) {
    window.localStorage.setItem(Const.user.localstorage, JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      email: user.email,
      gender: user.gender,
      role: user.roles,
      birthday: user.birthday,
      isMessagingToken: user.isMessagingToken
    }));
  }

  createUser(user) {
    return this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  login(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    localStorage.removeItem(Const.user.localstorage);
    return this.angularFireAuth.signOut();
  }

  getUserLogged() {
    const user = localStorage.getItem(Const.user.localstorage);
    return JSON.parse(user);
  }

  sendPasswordResetEmail(email) {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  getUserById(userId: string): Observable<User> {
    return this.doc$<User>(`${Const.collections.users}/${userId}`);
  }

  get currentUser$(): Observable<User> {
    return this.angularFireAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => this.getUserById(user.uid))
    );
  }
}
