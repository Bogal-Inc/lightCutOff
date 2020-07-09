import { Component, OnInit } from '@angular/core';
import {ReportService} from '@Services/report.service';
import {Observable} from 'rxjs';
import {Report} from '@Models/report.model';
import {convertSecondsToDate} from '@Helpers/date.helper';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-report-datatable',
  templateUrl: './report-datatable.component.html',
  styleUrls: ['./report-datatable.component.scss']
})
export class ReportDatatableComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;
  defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };
  columnDefs = [
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
      headerName: 'Longitude',
      field: 'position',
      valueFormatter: this.positionLngFormatter
    },
    {
      headerName: 'Lattitude',
      field: 'position',
      valueFormatter: this.positionLatFormatter
    }
  ];

  reports$: Observable<Report[]>;

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.reports$ = this.reportService.getReportsAll();
  }

  private dateFormatter(param) {
    if (param.value){
      return convertSecondsToDate(param.value.seconds);
    }
    return undefined;
  }

  private positionLngFormatter(param) {
    if (param.value){
      return param.value.lng;
    }
    return undefined;
  }

  private positionLatFormatter(param) {
    if (param.value){
      return param.value.lat;
    }
    return undefined;
  }

}
