import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Const } from '../../../../../../../environments/const';
import {Logger} from '@Services/logger.service';
import {environment} from '../../../../../../../environments/environment';

const log = new Logger('map-filter.component');

/** Filtres de la carte : coupure d'électricité / coupure d'eau en cours, ou service rétabli. */
export type MapFilterKey = 'electricity' | 'water' | 'resolved';

@Component({
  standalone: false,
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss']
})
export class MapFilterComponent implements OnInit {
  @Output() filtered: EventEmitter<MapFilterKey[]> = new EventEmitter<MapFilterKey[]>();
  readonly moduleEnable = environment.app.modules.mapFilter;
  readonly faFilter = faFilter;
  readonly markerElectricity = Const.markerColor.electricity;
  readonly markerWater = Const.markerColor.water;
  readonly markerRecovred = Const.markerColor.recovred;
  clickedFilters: MapFilterKey[] = [];

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

  mapFilter(filterKey: MapFilterKey) {
    const index = this.isClicked(filterKey);

    if (index >= 0) {
      this.clickedFilters.splice(index, 1);
    } else {
      this.clickedFilters.push(filterKey);
    }
    this.filtered.emit(this.clickedFilters);
  }

  isClicked(filterKey: MapFilterKey) {
    return this.clickedFilters.findIndex(x => filterKey === x);
  }
}
