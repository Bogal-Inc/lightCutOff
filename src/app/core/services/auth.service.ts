import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private angularFireAuth: AngularFireAuth
  ) { }

  anonymousAuth() {
    this.angularFireAuth.signInAnonymously().catch(err => {
      const errorCode = err.code;
      const errorMessage = err.message ;
    });
  }
}
