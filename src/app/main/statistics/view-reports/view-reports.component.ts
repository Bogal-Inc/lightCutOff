import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Report, ReportSatus} from '@Models/report.model';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {ReportService} from '@Services/report.service';
import {TimestampPipe} from '@Pipes/timestamp.pipe';


@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})
export class ViewReportsComponent implements OnInit {
  private gridApi;
  faExclamationCircle = faExclamationCircle;
  reports$: Observable<Report[]>;
  detailReportLightRight = false;
  reportSelected: any;
  defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };
  columnDefs = [
    {
      headerName: '',
      field: 'status',
      maxWidth: 50,
      filter: false,
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
          return this.timestampPipe.transform(params.value.seconds);
        }
      }
    },
    {
      headerName: 'Revenu le',
      field: 'recovredAt',
      cellRenderer: (params) => {
        if (params.value){
          return this.timestampPipe.transform(params.value.seconds);
        }
      }
    },
    {
      headerName: 'Adresse',
      field: 'addresses',
      valueFormatter: this.addressFormatter
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
  rowSelection = 'single';

  constructor(
    private reportService: ReportService,
    private timestampPipe: TimestampPipe
  ) { }

  ngOnInit(): void {
    this.reports$ = this.reportService.getReportsAll();
  }

  private addressFormatter(param) {
    if (param.value){
      return param.value[0].label;
    }
    return undefined;
  }

  onRowSelected(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.detailReportLightRight = true;
    this.reportSelected = selectedRows;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  close(event: any) {
    this.detailReportLightRight = false;
  }
}
