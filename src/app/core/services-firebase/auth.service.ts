import {SimpleUser, User} from '@Models/user.model';
import { Const } from 'src/environments/const';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService{

  authState: any = null;

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore
  ) {
    super(angularFireAuth, angularFirestore);

    this.angularFireAuth.authState.subscribe ((auth) => {
      this.authState = auth;
    });
  }

  anonymousAuth() {
    return this.angularFireAuth.signInAnonymously();
  }

  /**
   * Connexion Google (section admin uniquement). Remplace la session anonyme
   * courante — PAS de linkWithCredential : le site ne porte aucun historique
   * utilisateur, contrairement à l'app.
   */
  googleSignIn() {
    return this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * true si l'utilisateur courant (non anonyme) a `users/{uid}.role == 'admin'`
   * — MÊME définition qu'`isAdmin()` dans les règles Firestore de l'app :
   * la garde côté client n'est que de l'UX, la vraie protection est serveur.
   */
  isAdmin$(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (!user || user.isAnonymous) {
          return of(false);
        }
        return this.doc$<{ role?: string }>(`${Const.collections.users}/${user.uid}`).pipe(
          map(profile => profile?.role === 'admin'),
          catchError(() => of(false))
        );
      })
    );
  }

  /** Déconnexion admin : retour au modèle anonyme-first du site (lecture Firestore). */
  async signOutToAnonymous(): Promise<void> {
    await this.angularFireAuth.signOut();
    await this.anonymousAuth();
  }

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false;
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
