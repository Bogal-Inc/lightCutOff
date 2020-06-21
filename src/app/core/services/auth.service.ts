import { SimpleUser } from './../doc.model.ts/user.model';
import { Const } from 'src/environments/const';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

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

  getUser(): SimpleUser {
    return JSON.parse(localStorage.getItem(Const.user.localstorage));
  }

  // get current user
  get currentUser() {
    return this.user;
  }
}
