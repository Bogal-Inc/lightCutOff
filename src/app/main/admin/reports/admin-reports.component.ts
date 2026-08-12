import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Report, ReportSatus, ServiceType, reportServiceType } from '@Models/report.model';
import { ReportService } from '../../../core/services-firebase';
import { Logger } from '@Services/logger.service';

const log = new Logger('admin-reports.component');

/** État de modération dérivé — l'expiration prime sur l'archivage manuel. */
export type ModerationState = 'ongoing' | 'resolved' | 'expired' | 'archived';

export function moderationState(report: Report): ModerationState {
  if (report.autoExpiredAt) {
    return 'expired';
  }
  if (report.archivedAt) {
    return 'archived';
  }
  return report.status === ReportSatus.RESOLVED ? 'resolved' : 'ongoing';
}

/**
 * Modération des signalements (lot 2d v1) : table simple (sans ag-grid),
 * tous les signalements CM y compris archivés/expirés, filtres état/service,
 * action archiver/restaurer (permise à l'admin seul par les règles de l'app).
 */
@Component({
  standalone: false,
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit, OnDestroy {
  reports: Report[] = [];
  stateFilter: 'all' | ModerationState = 'all';
  serviceFilter: 'all' | ServiceType = 'all';
  /** pagination client simple : on affiche par tranches de 25 */
  displayCount = 25;
  loading = true;
  busyIds = new Set<string>();
  private sub?: Subscription;

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.sub = this.reportService.getReports({ includeHidden: true, limit: 500 }).subscribe(
      reports => {
        this.reports = reports;
        this.loading = false;
      },
      error => {
        log.error('reports load failed', error);
        this.loading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filteredReports(): Report[] {
    return this.reports.filter(report => {
      if (this.stateFilter !== 'all' && moderationState(report) !== this.stateFilter) {
        return false;
      }
      if (this.serviceFilter !== 'all' && reportServiceType(report) !== this.serviceFilter) {
        return false;
      }
      return true;
    });
  }

  get visibleReports(): Report[] {
    return this.filteredReports.slice(0, this.displayCount);
  }

  state(report: Report): ModerationState {
    return moderationState(report);
  }

  serviceEmoji(report: Report): string {
    return reportServiceType(report) === ServiceType.WATER ? '💧' : '⚡';
  }

  /** archivé manuellement OU expiré = masqué du public → l'action est « restaurer » */
  isHidden(report: Report): boolean {
    return !!report.archivedAt || !!report.autoExpiredAt;
  }

  showMore(): void {
    this.displayCount += 25;
  }

  resetPaging(): void {
    this.displayCount = 25;
  }

  async toggleArchived(report: Report): Promise<void> {
    if (!report.id || this.busyIds.has(report.id)) {
      return;
    }
    const archive = !this.isHidden(report);
    this.busyIds.add(report.id);
    try {
      await this.reportService.setArchivedByAdmin(report.id, archive);
      this.toastrService.success(this.translateService.instant(
        archive ? 'admin.reports.archived_ok' : 'admin.reports.restored_ok'
      ));
    } catch (error) {
      log.error('moderation update failed', error);
      this.toastrService.error(this.translateService.instant('admin.reports.action_error'));
    } finally {
      this.busyIds.delete(report.id);
    }
  }
}
