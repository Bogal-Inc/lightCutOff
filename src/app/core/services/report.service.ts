import {DocumentReference} from '@firebase/firestore-types';
import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {defaultReport, Report} from '@Models/report.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {Const} from 'src/environments/const';


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

  getReports(params: {
               isDeleted: boolean,
                datestart: Date
             }): Observable<Report[]> {
    this.analytics.logEvent('collect_report');

    return this.col$<Report>(
      `${Const.collections.reports}`,
      ref => {
        const responses = ref.where('_isDelete', '==', params.isDeleted);

        if (params.datestart) {
          responses.where('reportedAt', '>', params.datestart);
        }

        return responses.orderBy('reportedAt', 'desc');
      }
    );
  }

  async addReport(report): Promise<DocumentReference<DocumentData>>{
    this.analytics.logEvent('add_report');

    const ref = await this.add<Report>(
      `${Const.collections.reports}`,
      {
        ...defaultReport,
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
    this.analytics.logEvent('get_report');

    return this.doc$<Report>(
      `${Const.collections.reports}/${reportId}`
    );
  }

  updateReport(report: Report): Promise<void>{
    this.analytics.logEvent('update_report');

    const partialReport = {
      ...report,
      _updatedAt: this.timestamp,
      _UpdatedBy: this.user
    } as unknown as Report;
    return this.update<Report>(`${Const.collections.reports}/${report.id}`, partialReport);
  }
}
