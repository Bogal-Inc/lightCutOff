import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Report } from 'src/app/core/models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reports: Report[] = [];

  constructor(
    private firestore: AngularFirestore
  ) {
    this.getReports();
  }

  createReport(report: Report) {
    return this.firestore.collection('reports').add(report);
  }

  getReports() {
    return this.firestore.collection('reports').snapshotChanges();
  }

  updateReport(report: Report){
    delete report.id;
    return this.firestore.doc(report.url).update(report);
  }
}
