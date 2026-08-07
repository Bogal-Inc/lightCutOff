import { Report, reportServiceType } from '@Models/report.model';
import { Base } from '@Models/base.model';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-report-infos',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent implements Base, OnInit {
  data: {
    report: Report
  };

  get serviceType(): string {
    return reportServiceType(this.data.report);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
