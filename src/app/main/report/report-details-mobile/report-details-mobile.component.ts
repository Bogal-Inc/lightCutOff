import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReportService} from '@Services/report.service';

@Component({
  selector: 'app-report-details-mobile',
  templateUrl: './report-details-mobile.component.html',
  styleUrls: ['./report-details-mobile.component.scss']
})
export class ReportDetailsMobileComponent implements OnInit {

  constructor(
    private actiavteRoute: ActivatedRoute,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.getReport()
  }

  getReport(){
    const reportId = this.actiavteRoute.snapshot.queryParamMap.get('id');
    this.reportService.getReport(reportId).subscribe(
      report => console.log(report)
    );
  }

}
