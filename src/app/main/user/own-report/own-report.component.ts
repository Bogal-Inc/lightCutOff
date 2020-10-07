import {Component, OnDestroy, OnInit} from '@angular/core';
import {Report, ReportSatus} from '@Models/report.model';
import {Observable, Subject} from 'rxjs';
import {ReportService} from '@Services/report.service';
import {TranslateService} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '@Services/auth.service';
import {map, takeUntil} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkerRecovredReportComponent} from '../../map/components/marker-recovred-report/marker-recovred-report.component';
import {MapService} from '@Services/map.service';
import {MarkerDetailsComponent} from '../../map/components/marker-details/marker-details.component';


@Component({
  selector: 'app-own-report',
  templateUrl: './own-report.component.html',
  styleUrls: ['./own-report.component.scss']
})
export class OwnReportComponent implements OnInit, OnDestroy {
  private gridApi;
  reports$: Observable<Report[]>;
  paginationPageSize;
  rowSelection = 'single';
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

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private authService: AuthService,
    private timestampPipe: TimestampPipe,
    private mapService: MapService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const now = new Date();
    this.reports$ = this.reportService.getReports({
      isDeleted: false,
      datestart: new Date(now.getFullYear() + '/1/1')
    })
    .pipe(
      map((reports) => {
        return reports.filter(
          (report) => this.authService.getUser().id === report._createdBy.id
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
    // this.analytics.logEvent('report_selected');
    const selectedRows = this.gridApi.getSelectedRows();

    if (selectedRows[0].recovredAt) {
      this.createMpdal(MarkerDetailsComponent, selectedRows[0]);
      // modalRef = this.modalService.open(
      //   MarkerDetailsComponent,
      //   {
      //     centered: true,
      //     size: 'lg'
      //   });
      // modalRef.componentInstance.data = selectedRows[0];
    } else {
      this.createMpdal(MarkerRecovredReportComponent, {
        report: selectedRows[0],
        list: true
      });
      // modalRef = this.modalService.open(
      //   MarkerRecovredReportComponent,
      //   {
      //     centered: true,
      //     size: 'lg'
      //   });
      // modalRef.componentInstance.data = {
      //   report: selectedRows[0],
      //   list: true
      // };
    }

    // modalRef.result.then((result) => {
    //   console.log(result);
    // }, (reason) => {
    // });
  }

  private createMpdal(component, data) {
    const modalRef = this.modalService.open(
      component,
      {
        centered: true,
        size: 'lg'
      });
    modalRef.componentInstance.data = data;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
}
