import { DocumentReference } from '@firebase/firestore-types';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Report, defaultReport } from '@Models/report.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Const } from 'src/environments/const';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  reports: Report[] = [];

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore
  ) {
    super(angularFireAuth, angularFirestore);
  }

  getReports(isDeleted: boolean = false, isVisible: boolean = false): Observable<Report[]> {
    return this.col$<Report>(
      `${Const.collections.reports}`,
      ref => {
        const response = ref.where('_isDelete', '==', isDeleted);
        response.where('_isVisible', '==', isVisible);
        return response;
      }
    );
  }

  getReportsAll(): Observable<Report[]> {
    return this.col$<Report>(`${Const.collections.reports}`);
  }

  async addReport(report): Promise<DocumentReference<DocumentData>>{
    const ref = await this.add<Report>(
      `${Const.collections.reports}`,
      {
        ...defaultReport,
        id: uuid.v4(),
        reportedAt: report.reportedAt,
        position: this.geopoint(report.position.lat, report.position.lng),
        _createdBy: this.user,
        _createdAt: this.timestamp,
      } as unknown as Report
    );
    return ref;
  }

  deleteReport(reportId: string) {
    const partialReport = {
      _isDeleted: true,
      _deletedAt: this.timestamp,
      _deletedBy: this.user
    } as unknown as Report;
    this.update(
      `${Const.collections.reports}/${reportId}`,
      partialReport
    );
  }

  getReport(reportId: string): Observable<Report> {
    return this.doc$<Report>(
      `${Const.collections.reports}/${reportId}`
    );
  }

// TODO: sans doute a refactor pour changer le call du doc
  updateReport(report: Report): Promise<void>{
    delete report.id;
    return this.angularFirestore.doc(report.url).update(report);
  }
}
