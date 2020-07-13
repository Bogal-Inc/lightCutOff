import { Report } from '@Models/report.model';
import { BaseComponent } from '@Models/baseComponent.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-infos',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent implements BaseComponent, OnInit {
  data: Report;

  constructor() { }

  ngOnInit(): void {
  }

}
