import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import { environment } from 'src/environments/environment';

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
    // CF `contactus` (codebase "website") déployée sur le projet de l'environnement
    // courant (njuka-prod / lightcutoff-dev) — envoi via Brevo vers support@njuka.app
    return this.httpClient.post(
      `https://us-central1-${environment.firebase.projectId}.cloudfunctions.net/contactus`,
      JSON.stringify(sender),
      {
        ...httpOptions,
        responseType: 'text'
      }
    );
  }
}
