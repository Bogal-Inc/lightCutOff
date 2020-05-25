import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Report } from 'src/app/core/models/report.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private db = firebase.database();
  reports: Report[] = [];
  reportsSubject = new Subject<Report[]>();

  constructor() {
    this.getReports();
  }

  createNewBook(report: Report) {
    this.reports.push(report);

    this.saveReport(report);
    this.emitReports();
  }

  getReports() {
    this.db.ref('/reports')
              .on('value', (data: firebase.database.DataSnapshot) => {
                this.reports = data.val() ? data.val() : [];

                this.emitReports();
              });
  }

  private saveReport(report: Report){
    this.db.ref('/reports').set(report);
  }

  emitReports() {
    this.reportsSubject.next(this.reports);
  }
}
