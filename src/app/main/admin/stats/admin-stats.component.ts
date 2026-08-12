import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from '../../../core/services-firebase';
import { Logger } from '@Services/logger.service';
import { ReportStats, computeReportStats, formatMinutes } from './report-stats';

const log = new Logger('admin-stats.component');

/**
 * Statistiques admin (lot 2d) — agrégats calculés côté client sur les
 * signalements CM (archivés/expirés inclus, requête plafonnée). Remplace le
 * dashboard 2022 (vieux schéma, chart.js) par des cartes simples.
 */
@Component({
  standalone: false,
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss']
})
export class AdminStatsComponent implements OnInit, OnDestroy {
  stats: ReportStats | null = null;
  loading = true;
  private sub?: Subscription;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.sub = this.reportService.getReports({ includeHidden: true, limit: 1000 }).subscribe(
      reports => {
        this.stats = computeReportStats(reports);
        this.loading = false;
      },
      error => {
        log.error('stats load failed', error);
        this.loading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get avgResolution(): string | null {
    return this.stats?.avgResolutionMinutes != null
      ? formatMinutes(this.stats.avgResolutionMinutes)
      : null;
  }
}
