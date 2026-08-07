import {Component, OnDestroy, OnInit} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Observable, Subject} from 'rxjs';
import {ReportService} from '../../../core/services-firebase';
import {TranslateService} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../core/services-firebase';
import {map, takeUntil} from 'rxjs/operators';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {Logger} from '@Services/logger.service';
import {Const} from '../../../../environments/const';

const log = new Logger('own-report.component');

@Component({
  standalone: false,
  selector: 'app-own-report',
  templateUrl: './own-report.component.html',
  styleUrls: ['./own-report.component.scss']
})
export class OwnReportComponent implements OnInit, OnDestroy {
  private gridApi;
  readonly faExclamationCircle = faExclamationCircle;
  readonly unsubsscribe$ = new Subject<void>();
  readonly defaultColDef = {
    flex: 1
  };
  readonly columnDefs = [
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
    }];

  reports$: Observable<Report[]>;
  report: Report;
  paginationPageSize;
  rowSelection = 'single';

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private authService: AuthService,
    private timestampPipe: TimestampPipe,
    private analytics: AngularFireAnalytics,
  ) { }

  ngOnInit(): void {
    log.debug('init');
    this.analytics.logEvent('page_view', {
      page_location: 'https://lightcutoff.com/own-report',
      page_path: '/own-report',
      page_title: 'own report'
    });

    const now = new Date();
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear() + '/1/1')
    })
    .pipe(
      map((reports) => {
        return reports.filter(
          (report) => {
            const user = JSON.parse(localStorage.getItem(Const.user.localstorage));
            return user.id === report._createdBy.id;
          }
        );
      }),
      takeUntil(this.unsubsscribe$)
    );

    this.paginationPageSize = 10;
  }

  ngOnDestroy(): void {
    this.unsubsscribe$.next();
    this.unsubsscribe$.complete();
  }

  onRowSelected(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.report = selectedRows[0];
    this.analytics.logEvent('select_content', this.report);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
}
