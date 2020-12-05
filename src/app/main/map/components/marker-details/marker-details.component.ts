import { Report } from '@Models/report.model';
import { Base } from '@Models/base.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-infos',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent implements Base, OnInit {
  data: {
    report: Report
  };

  constructor() { }

  ngOnInit(): void {
  }

}
