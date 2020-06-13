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

  // get current user
  get currentUser() {
    return this.user;
  }
}
