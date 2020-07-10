import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Report} from '@Models/report.model';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {convertSecondsToDate} from '@Helpers/date.helper';
import {ReportService} from '@Services/report.service';


@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})
export class ViewReportsComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;
  reports$: Observable<Report[]>;
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

  constructor(
    private reportService: ReportService
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

  private addressFormatter(param) {
    if (param.value){
      return param.value[0].label;
    }
    return undefined;
  }

}
