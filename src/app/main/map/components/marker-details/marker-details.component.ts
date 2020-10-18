import { Report } from '@Models/report.model';
import { BaseComponent } from '@Models/baseComponent.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-infos',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent implements BaseComponent, OnInit {
  data: {
    report: Report,
    map: true
  };
  report: Report;

  constructor() { }

  ngOnInit(): void {
  }

}
