import { Component, OnInit } from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Observable} from 'rxjs';
import {ReportService} from '@Services/report.service';
import {TranslateService} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-own-report',
  templateUrl: './own-report.component.html',
  styleUrls: ['./own-report.component.scss']
})
export class OwnReportComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;
  defaultColDef = {
    flex: 1
  };
  columnDefs = [
    {
      headerName: '',
      field: 'status',
      maxWidth: 50,
      cellRenderer: (params) => {
        if (params.value === ReportSatus.CUT){
          return '<span class="fas fa-circle text-danger"></span>';
        } else {
          return '<span class="fas fa-circle text-success"></span>';
        }
      }
    },
    {
      headerName: 'Signalé le',
      field: 'reportedAt',
      cellRenderer: (params) => {
        if (params.value){
          return this.timestampPipe.transform(params.value.toDate());
        }
      }
    },
    {
      headerName: 'Revenu le',
      field: 'recovredAt',
      cellRenderer: (params) => {
        if (params.value){
          return this.timestampPipe.transform(params.value.toDate());
        }
      }
    },
    {
      headerName: 'Departement',
      field: 'location',
      cellRenderer: (params) => {
        return params.value.department;
      }
    },
    {
      headerName: 'Ville',
      field: 'location',
      cellRenderer: (params) => {
        return params.value.city;
      }
    }
  ];

  reports$: Observable<Report[]>;
  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private timestampPipe: TimestampPipe
  ) { }

  ngOnInit(): void {
    const now = new Date();
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear() + '/1/1')
    });
  }

}
