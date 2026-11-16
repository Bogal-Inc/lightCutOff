import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {GeoArea, Position, Report, ReportSatus, ServiceType} from '@Models/report.model';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Observable} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import {Const} from 'src/environments/const';
import { CollectionReference, Query } from '@firebase/firestore-types';
import firebase from 'firebase/compat/app';
import {encodeGeohash} from '@Helpers/geo.helper';

/**
 * Lecture des signalements Njuka (`reports/{id}`, schéma de l'app — SCHEMA.md).
 * Le site est en LECTURE SEULE : requête mondiale triée par date (NJUKA est
 * disponible partout — cloisonnement pays retiré), les signalements archivés
 * (soft-delete) et expirés (autoExpiredAt) sont écartés côté client.
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
      includeHidden?: boolean
    } = {}
  ): Observable<Report[]> {
    // attend la session (anonyme comprise) : les règles Firestore exigent isSignedIn()
    return this.angularFireAuth.authState.pipe(
      first(user => !!user),
      switchMap(() => this.col$<Report>(
      `${Const.collections.reports}`,
      ref => {
        let query: CollectionReference | Query = ref;
        query = query.orderBy('reportedAt', 'desc');

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
   * Création d'un signalement citoyen depuis le site (session anonyme comprise,
   * comme l'app depuis le pivot 2026-06-24). Document écrit AU SCHÉMA EXACT de
   * l'app (SCHEMA.md) — pas de champs d'audit `_createdBy` du site. Les règles
   * exigent uniquement `userId == auth.uid` ; les CF app (notifs 500 m, cycle
   * de vie) prennent le relais côté serveur.
   */
  async createReport(input: {
    serviceType: ServiceType;
    description: string | null;
    position: Position;
    location: GeoArea;
    /** gps (défaut) | described — même sémantique que l'app (SCHEMA.md). */
    positionSource?: 'gps' | 'described';
    /** Date/heure de constatation (app) ; absent = « maintenant » (serveur). */
    reportedAt?: Date | null;
  }): Promise<string> {
    const user = await this.angularFireAuth.authState.pipe(first(u => !!u)).toPromise();
    const serverNow = firebase.firestore.FieldValue.serverTimestamp();

    const docRef = await this.col(Const.collections.reports).add({
      userId: user.uid,
      authorUsername: null,
      status: ReportSatus.ONGOING,
      type: 'unplanned',
      serviceType: input.serviceType,
      position: { lat: input.position.lat, lng: input.position.lng },
      location: input.location,
      description: input.description,
      mediaUrl: null,
      geohash: encodeGeohash(input.position.lat, input.position.lng),
      positionSource: input.positionSource || 'gps',
      confirmationCount: 0,
      restorationCount: 0,
      notifiedUserIds: [],
      reportedAt: input.reportedAt ? firebase.firestore.Timestamp.fromDate(input.reportedAt) : serverNow,
      resolvedAt: null,
      archivedAt: null,
      createdAt: serverNow,
      updatedAt: serverNow
    });
    return docRef.id;
  }

  /**
   * Confirme une coupure existante (anti-doublon) : batch ATOMIQUE exigé par
   * les règles — `confirmationCount` +1 (bumpsCounterByOne) et dépôt simultané
   * du vote `confirmations/{uid}` (castsVote). Interdit sur son propre report.
   */
  async confirmReport(reportId: string, position: Position): Promise<void> {
    const user = await this.angularFireAuth.authState.pipe(first(u => !!u)).toPromise();
    const serverNow = firebase.firestore.FieldValue.serverTimestamp();

    const reportRef = this.doc(`${Const.collections.reports}/${reportId}`).ref;
    const batch = reportRef.firestore.batch();
    batch.update(
      reportRef as any,
      {
        confirmationCount: firebase.firestore.FieldValue.increment(1),
        updatedAt: serverNow
      }
    );
    batch.set(
      this.col(`${Const.collections.reports}/${reportId}/confirmations`).doc(user.uid).ref as any,
      {
        createdAt: serverNow,
        geohash: encodeGeohash(position.lat, position.lng),
        position: { lat: position.lat, lng: position.lng }
      }
    );
    return batch.commit();
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
