import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Const } from 'src/environments/const';
import { OfficialOutage, upcomingOfficialOutages } from '@Models/official-outage.model';
import { BaseService } from './base.service';

/**
 * Lecture des coupures planifiées officielles (`official_outages`, programme SOCADEL ex-Eneo
 * ingéré quotidiennement par la CF de l'app). Même stratégie que l'app : requête
 * MONO-CHAMP (`country ==`) — aucun index composite à déployer — puis filtre date
 * (≥ aujourd'hui) et tri côté client (volume modeste par pays).
 */
@Injectable({
  providedIn: 'root'
})
export class OfficialOutageService extends BaseService {

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore,
  ) {
    super(angularFireAuth, angularFirestore);
  }

  getUpcoming(): Observable<OfficialOutage[]> {
    // attend la session (anonyme comprise) : les règles Firestore exigent isSignedIn()
    return this.angularFireAuth.authState.pipe(
      first(user => !!user),
      switchMap(() => this.col$<OfficialOutage>(
        `${Const.collections.officialOutages}`,
        ref => ref.where('country', '==', Const.countryCode)
      )),
      map(outages => upcomingOfficialOutages(outages))
    );
  }
}
