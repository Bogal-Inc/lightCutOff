import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Report, ReportSatus} from '@Models/report.model';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {ReportService} from '@Services/report.service';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { isMobile } from '@Helpers/mobile-confirm.helper';
import {Router} from '@angular/router';
import {Logger} from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';

const log = new Logger('router-list.component');

@Component({
  selector: 'app-view-reports',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  private gridApi;
  readonly projectTitle = Const.app.title;
  faExclamationCircle = faExclamationCircle;
  reports$: Observable<Report[]>;
  detailReportLightRight = false;
  reportSelected: any;
  defaultColDef: any;
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
    private timestampPipe: TimestampPipe,
    private router: Router,
    private translateService: TranslateService,
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.datatableMobilConfig();
    const now = new Date();
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear())
    });
    this.metaService.initMetatoAboutUs('report.report-list.title_page');
  }

  addressFormatter(param) {
    if (param.value){
      return param.value[0].label;
    }
    return undefined;
  }

  onRowSelected(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.detailReportLightRight = true;
    this.reportSelected = selectedRows;

    if (isMobile()) {
      const reportId = this.reportSelected[0].id;
      this.router.navigate(['/report'], { queryParams: {id: reportId} });
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  close(event: any) {
    this.detailReportLightRight = false;
  }

  datatableMobilConfig() {
    if (!isMobile()){
      this.defaultColDef = {
        flex: 1,
        sortable: true,
        filter: true,
        floatingFilter: true,
      };
    } else {
      this.defaultColDef = {
        sortable: true,
        filter: true,
        floatingFilter: true,
      };
    }
  }

  isMobiled() {
    return isMobile();
  }
}
