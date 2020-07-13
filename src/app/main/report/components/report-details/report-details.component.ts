import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Report, ReportSatus} from '@Models/report.model';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss'],
  animations: [
    trigger('detailReportLightRight', [
      state('right', style({
        transform: 'translateX(0%)'
      })),
      state('left', style({
        transform: 'translateX(130%)'
      })),
      transition('right => left', [
        animate('0.5s')
      ]),
      transition('left => right', [
        animate('0.5s')
      ]),
    ]),
    trigger('btnDetailReportLightRight', [
      state('right', style({
        transform: 'translateX(0%)'
      })),
      state('left', style({
        transform: 'translateX(100%)'
      })),
      transition('right => left', [
        animate('0.5s')
      ]),
      transition('left => right', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class ReportDetailsComponent implements OnInit, OnChanges {
  @Output() showDetail: EventEmitter<any> = new EventEmitter<any>();
  @Input() detailReportLightRight: boolean;
  @Input() report: Report;
  reportStatus: boolean;
  faTimes = faTimes;
  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.report?.currentValue) {
      this.report = changes.report.currentValue[0];
      this.reportStatus = (this.report?.status === ReportSatus.CUT);
    }
  }

  closeDetails() {
    this.showDetail.emit(this.detailReportLightRight);
  }
}

