import {Component, Input, OnInit} from '@angular/core';
import {ReportService} from '../../../../core/services-firebase/report.service';
import {Report, ReportSatus} from '@Models/report.model';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

@Component({
  selector: 'app-report-datatable',
  templateUrl: './report-datatable.component.html',
  styleUrls: ['./report-datatable.component.scss']
})
export class ReportDatatableComponent implements OnInit {
  @Input() reports: Report[];
  readonly faExclamationCircle = faExclamationCircle;
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

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private timestampPipe: TimestampPipe
  ) { }

  ngOnInit(): void {}
}
