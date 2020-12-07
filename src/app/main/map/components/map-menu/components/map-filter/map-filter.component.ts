import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Const } from '../../../../../../../environments/const';
import {Logger} from '@Services/logger.service';
import {ReportSatus} from '@Models/report.model';
import {environment} from '../../../../../../../environments/environment';

const log = new Logger('map-filter.component');

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss']
})
export class MapFilterComponent implements OnInit {
  @Output() filtered: EventEmitter<ReportSatus[]> = new EventEmitter<ReportSatus[]>();
  readonly moduleEnable = environment.app.modules.mapFilter;
  readonly faFilter = faFilter;
  readonly markerCut = Const.markerColor.cut;
  readonly markerRecovred = Const.markerColor.recovred;
  readonly markerCutUser = Const.markerColor.cutUser;
  readonly reportSatus = {
    cut: ReportSatus.CUT,
    cut_owner: ReportSatus.CUT_OWNER,
    recovred: ReportSatus.CUT_COMPLETED
  };
  clickedStatus: ReportSatus[] = [];

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

  mapFilter(reportSatusFilter: ReportSatus) {
    if (this.clickedStatus.length === 0) {
      this.clickedStatus.push(reportSatusFilter);
    } else {
      const index = this.isClicked(reportSatusFilter);

      if (index >= 0) {
        this.clickedStatus.splice(index, 1);
      } else {
        this.clickedStatus.push(reportSatusFilter);
      }
    }
    this.filtered.emit(this.clickedStatus);
  }

  isClicked(reportSatusFilter) {
    if (this.clickedStatus) {
      return this.clickedStatus.findIndex(x => reportSatusFilter === x);
    }
    return -1;
  }
}
