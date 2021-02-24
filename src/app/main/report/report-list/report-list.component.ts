import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Report, ReportSatus} from '@Models/report.model';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {ReportService} from '../../../core/services-firebase';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { isMobile } from '@Helpers/mobile-confirm.helper';
import {Router} from '@angular/router';
import {Logger} from '@Services/logger.service';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../../environments/const';
import {MetaService} from '@Services/meta.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('router-list.component');

@Component({
  selector: 'app-view-reports',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  private gridApi;
  readonly projectTitle = Const.app.title;
  isMobile: boolean;
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
      headerName: 'Région',
      field: 'location',
      cellRenderer: (params) => {
        return params.value.region;
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
    },
    {
      headerName: 'Quartier',
      field: 'location',
      cellRenderer: (params) => {
        return params.value.neighborhood;
      }
    }
  ];
  rowSelection = 'single';

  constructor(
    private reportService: ReportService,
    private timestampPipe: TimestampPipe,
    private router: Router,
    private translateService: TranslateService,
    private metaService: MetaService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/reports',
      page_path: '/reports',
      page_title: 'Reports list'
    });

    this.datatableMobilConfig();
    const now = new Date();
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear())
    });
    this.isMobile = isMobile();
  }

  onRowSelected(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.detailReportLightRight = true;
    this.reportSelected = selectedRows;

    this.analytics.logEvent('select_content', {
      report: this.reportSelected[0],
      where: 'report-list'
    });

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
}
