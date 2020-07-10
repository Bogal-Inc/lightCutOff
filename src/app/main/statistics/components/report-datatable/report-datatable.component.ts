import { Component, OnInit } from '@angular/core';
import {ReportService} from '@Services/report.service';
import {Observable} from 'rxjs';
import {Report, ReportSatus} from '@Models/report.model';
import {convertSecondsToDate} from '@Helpers/date.helper';
import { faExclamationCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report-datatable',
  templateUrl: './report-datatable.component.html',
  styleUrls: ['./report-datatable.component.scss']
})
export class ReportDatatableComponent implements OnInit {
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
      valueFormatter: this.dateFormatter
    },
    {
      headerName: 'Revenu le',
      field: 'recovredAt',
      valueFormatter: this.dateFormatter
    },
    {
      headerName: 'Ville',
      field: 'city',
    },
    {
      headerName: 'Pays',
      field: 'country',
    }
  ];

  reports$: Observable<Report[]>;

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.reports$ = this.reportService.getReportsAll();
  }

  private dateFormatter(param) {
    if (param.value){
      return convertSecondsToDate(param.value.seconds).toLocaleString();
    }
    return undefined;
  }

  private statusFormat(param){
    if (param.value === 0){
      return 'no';
    } else {
      return 'yes';
    }
  }
}
