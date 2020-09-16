import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAnalytics} from '@angular/fire/analytics';

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
    private httpClient: HttpClient,
    private analytics: AngularFireAnalytics,
    public afs: AngularFirestore
  ) {
    super(afAuth, afs);
  }

  sendMail(sender): Observable<any>{
    this.analytics.logEvent('contact_us');
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
