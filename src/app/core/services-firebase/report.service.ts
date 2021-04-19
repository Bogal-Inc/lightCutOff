import {DocumentReference} from '@firebase/firestore-types';
import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {defaultReport, Report, ReportSatus} from '@Models/report.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {Const} from 'src/environments/const';
import { CollectionReference, Query } from '@firebase/firestore-types';


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
      isDeleted: boolean,
      datestart?: Date,
      limit?: number,
      reportStatus?: ReportSatus
    }
  ): Observable<Report[]> {
    return this.col$<Report>(
      `${Const.collections.reports}`,
      ref => {
        let query: CollectionReference | Query = ref;
        query = query.where('_isDelete', '==', params.isDeleted);

        if (params.reportStatus) {
          query = query.where('status', '==', params.reportStatus);
        } else if (params.datestart) {
          query = query.orderBy('reportedAt', 'desc').endAt(params.datestart);
        } else if (params.limit) {
          query = query.limit(params.limit);
        }
        return query;
      }
    );
  }

  async addReport(report): Promise<DocumentReference<DocumentData>>{
    return await this.add<Report>(
      `${Const.collections.reports}`,
      {
        ...defaultReport,
        reportedAt: report.reportedAt,
        location: report.location,
        position: {lat: report.position.lat, lng: report.position.lng},
        _createdBy: this.user,
        _createdAt: this.timestamp,
      } as unknown as Report
    );
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

  updateReport(report: Report): Promise<void>{
    return this.update<Report>(`${Const.collections.reports}/${report.id}`, report);
  }
}
