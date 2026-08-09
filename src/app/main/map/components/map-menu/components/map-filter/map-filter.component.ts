import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons';
import {Logger} from '@Services/logger.service';
import {ReportSatus, ServiceType} from '@Models/report.model';
import {environment} from '../../../../../../../environments/environment';

const log = new Logger('map-filter.component');

export type ReportSort = 'recent' | 'active' | 'confirmed';

/**
 * Mêmes filtres que l'application mobile :
 * - barre segmentée de service, toujours visible (Tout / ⚡ Élec. / 💧 Eau) ;
 * - panneau « Filtres » repliable (comme la bottom-sheet de l'app) avec le
 *   statut (En cours / Rétabli, bascules) et le tri (Récentes / Actives / Confirmées).
 */
export interface MapFilter {
  service: ServiceType | null;
  statuses: ReportSatus[];
  sort: ReportSort;
}

@Component({
  standalone: false,
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss']
})
export class MapFilterComponent implements OnInit {
  @Output() filtered: EventEmitter<MapFilter> = new EventEmitter<MapFilter>();
  readonly moduleEnable = environment.app.modules.mapFilter;
  readonly faSlidersH = faSlidersH;
  readonly serviceType = ServiceType;
  readonly reportStatus = ReportSatus;

  service: ServiceType | null = null;
  statuses: ReportSatus[] = [];
  sort: ReportSort = 'recent';
  /** Panneau statut/tri replié par défaut (s'ouvre via le bouton Filtres, comme la sheet de l'app). */
  expanded = false;

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  /** Nombre de filtres actifs affiché sur le bouton (hors service, visible en permanence). */
  get activeCount(): number {
    return this.statuses.length + (this.sort !== 'recent' ? 1 : 0);
  }

  setService(service: ServiceType | null) {
    this.service = service;
    this.emit();
  }

  toggleStatus(status: ReportSatus) {
    const index = this.statuses.indexOf(status);
    if (index >= 0) {
      this.statuses.splice(index, 1);
    } else {
      this.statuses.push(status);
    }
    this.emit();
  }

  isStatusActive(status: ReportSatus) {
    return this.statuses.includes(status);
  }

  setSort(sort: ReportSort) {
    this.sort = sort;
    this.emit();
  }

  private emit() {
    this.filtered.emit({ service: this.service, statuses: [...this.statuses], sort: this.sort });
  }
}
