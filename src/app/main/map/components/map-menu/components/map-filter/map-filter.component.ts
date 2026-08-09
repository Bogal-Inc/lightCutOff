import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {ReportSatus, ServiceType} from '@Models/report.model';
import {environment} from '../../../../../../../environments/environment';

const log = new Logger('map-filter.component');

/**
 * Mêmes filtres que l'application mobile :
 * - sélecteur segmenté de service (Tout / ⚡ Élec. / 💧 Eau, choix unique) ;
 * - statut (En cours / Rétablies, bascule — aucun coché = tous).
 */
export interface MapFilter {
  service: ServiceType | null;
  statuses: ReportSatus[];
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
  readonly serviceType = ServiceType;
  readonly reportStatus = ReportSatus;

  service: ServiceType | null = null;
  statuses: ReportSatus[] = [];

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
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

  private emit() {
    this.filtered.emit({ service: this.service, statuses: [...this.statuses] });
  }
}
