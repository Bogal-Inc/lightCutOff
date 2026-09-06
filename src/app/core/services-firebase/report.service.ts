import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Report, ReportSatus} from '@Models/report.model';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Observable} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import {Const} from 'src/environments/const';
import { CollectionReference, Query } from '@firebase/firestore-types';
import firebase from 'firebase/compat/app';

/**
 * Lecture des signalements Njuka (`reports/{id}`, schéma de l'app — SCHEMA.md).
 * Le site est en LECTURE SEULE : requête cloisonnée au pays (index composite
 * `location.countryCode ASC, reportedAt DESC` déployé côté app), les signalements
 * archivés (soft-delete) et expirés (autoExpiredAt) sont écartés côté client.
 */

/**
 * Prédicat d'affichage public : écarte le soft-delete (`archivedAt`) ET l'expiration
 * silencieuse 48 h (`autoExpiredAt`, cron `reportLifecycle` v1.3.0). Le cron pose les
 * deux champs ensemble aujourd'hui, mais le site filtre chacun explicitement pour ne
 * pas dépendre de ce couplage (P0 roadmap : pas de coupures fantômes « en cours »).
 */
export function isPubliclyVisible(report: Report): boolean {
  return !report.archivedAt && !report.autoExpiredAt;
}
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  reports: Report[] = [];

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore,
  ) {
    super(angularFireAuth, angularFirestore);
  }

  getReports(
    params: {
      datestart?: Date,
      limit?: number,
      reportStatus?: ReportSatus,
      /** admin uniquement : inclut archivés + expirés (modération) */
      includeHidden?: boolean,
      /** admin uniquement : tous pays (sinon cloisonné sur Const.countryCode) */
      allCountries?: boolean
    } = {}
  ): Observable<Report[]> {
    // attend la session (anonyme comprise) : les règles Firestore exigent isSignedIn()
    return this.angularFireAuth.authState.pipe(
      first(user => !!user),
      switchMap(() => this.col$<Report>(
      `${Const.collections.reports}`,
      ref => {
        let query: CollectionReference | Query = ref;
        // Admin « tous pays » : requête simple triée par date (pas d'index
        // composite requis, contrairement au cloisonnement par pays).
        query = params.allCountries
          ? query.orderBy('reportedAt', 'desc')
          : query
              .where('location.countryCode', '==', Const.countryCode)
              .orderBy('reportedAt', 'desc');

        if (params.limit) {
          query = query.limit(params.limit);
        }
        return query;
      }
    )),
      map(reports => reports.filter(report => {
        if (!params.includeHidden && !isPubliclyVisible(report)) {
          return false;
        }
        if (params.reportStatus && report.status !== params.reportStatus) {
          return false;
        }
        if (params.datestart && report.reportedAt?.toDate() < params.datestart) {
          return false;
        }
        return true;
      }))
    );
  }

  getReport(reportId: string): Observable<Report> {
    return this.angularFireAuth.authState.pipe(
      first(user => !!user),
      switchMap(() => this.doc$<Report>(
        `${Const.collections.reports}/${reportId}`
      ))
    );
  }

  /**
   * Modération (admin uniquement, garanti par les règles) : archive ou restaure
   * un signalement. Les règles n'autorisent l'admin qu'à toucher EXACTEMENT
   * `archivedAt` / `autoExpiredAt` / `updatedAt` — update direct, sans les
   * champs d'audit `_updatedBy` de BaseService.update() (ils violeraient le
   * hasOnly des règles). Restaurer efface AUSSI `autoExpiredAt`, sinon le
   * signalement resterait masqué du public (isPubliclyVisible).
   */
  setArchivedByAdmin(reportId: string, archived: boolean): Promise<void> {
    const serverNow = firebase.firestore.FieldValue.serverTimestamp();
    return this.doc(`${Const.collections.reports}/${reportId}`).update({
      archivedAt: archived ? serverNow : null,
      ...(archived ? {} : { autoExpiredAt: null }),
      updatedAt: serverNow
    });
  }
}
