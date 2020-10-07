import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Const } from '../../../../../environments/const';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss']
})
export class MapFilterComponent implements OnInit {
  readonly faFilter = faFilter;
  readonly markerCut = Const.markerColor.cut;
  readonly markerRecovred = Const.markerColor.recovred;
  readonly markerCutUser = Const.markerColor.cutUser;

  constructor() { }

  ngOnInit(): void {
  }

}
