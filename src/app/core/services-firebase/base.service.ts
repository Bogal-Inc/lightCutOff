import { SimpleUser } from '@Models/user.model';
import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryFn
} from '@angular/fire/compat/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Doc } from '@Models/doc.model';
import firebase from 'firebase/compat/app';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected user: SimpleUser;
  protected readonly injector = inject(EnvironmentInjector);

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore
  ) {
    this.onAnonymous();
  }

  private onAnonymous() {
    this.angularFireAuth.onAuthStateChanged(user => {
      if (user) {
        this.user = { id: user.uid } as SimpleUser;
      } else { this.user = null; }
    });
  }

  /// **************
  /// Get a Reference
  /// **************
  protected col<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): AngularFirestoreCollection<T> {
    // runInInjectionContext : les wrappers compat de @angular/fire v20 appellent inject()
    // dans leurs initialiseurs de champs, ce qui échoue hors contexte d'injection (NG0203)
    return typeof ref === 'string'
      ? runInInjectionContext(this.injector, () => this.angularFirestore.collection<T>(ref, queryFn))
      : ref;
  }

  protected doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string'
      ? runInInjectionContext(this.injector, () => this.angularFirestore.doc<T>(ref))
      : ref;
  }

  /// **************
  /// Get Data
  /// **************
  protected doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data = doc.payload.data() as any;
          const id = doc.payload.id;
          if (data) {
            return {
              id,
              ...data
            } as T;
          } else {
            return null;
          }
        })
      );
  }

  protected col$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<any[]> {
    return this.col(ref, queryFn)
      .valueChanges({ idField: 'id' });
  }

  protected set<T extends Doc>(ref: any, data: any) {
    return this.col(ref).doc(data.id).set({
      ...data,
      _createdAt: this.timestamp,
      _createdBy: this.user,
      _updatedAt: this.timestamp,
      _updatedBy: this.user
    } as T);
  }

  protected update<T extends Doc>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      _updatedAt: this.timestamp,
      _updatedBy: this.user
    });
  }

  protected delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete();
  }

  protected add<T>(ref: CollectionPredicate<T>, data): Promise<DocumentReference> {
    return this.col(ref).add({
      ...data,
      _createdAt: this.timestamp,
      _createdBy: this.user,
      _updatedAt: this.timestamp,
      _updatedBy: this.user
    });
  }

  /// If doc exists update, otherwise set
  protected upsert<T>(ref: DocPredicate<Doc>, data: any) {
    const doc = this.doc(ref)
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    });
  }

  protected geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  /// **************
  /// Write Data
  /// **************
  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  fromDate(date: Date): firebase.firestore.Timestamp {
    return firebase.firestore.Timestamp.fromDate(date);
  }
}
