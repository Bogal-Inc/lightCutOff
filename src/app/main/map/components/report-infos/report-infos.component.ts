import { Report } from '@Models/report.model';
import { BaseComponent } from '@Models/baseComponent.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-infos',
  templateUrl: './report-infos.component.html',
  styleUrls: ['./report-infos.component.scss']
})
export class ReportInfosComponent implements BaseComponent, OnInit {
  data: Report;

  constructor() { }

  ngOnInit(): void {
  }

}
