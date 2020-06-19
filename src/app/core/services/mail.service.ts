import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MailService extends BaseService {
  api: any;

  constructor(
    afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private httpClient: HttpClient
  ) {
    super(afAuth, afs);
  }

  sendMail(sender): Observable<any>{
    return this.httpClient.post(
      'https://us-central1-lightcutoff.cloudfunctions.net/contactus',
      JSON.stringify(sender),
      {
        ...httpOptions,
        responseType: 'text'
      }
    );
  }
}
