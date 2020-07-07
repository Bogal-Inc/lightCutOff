import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';

const log = new Logger('map-legend.component');

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss']
})
export class MapLegendComponent implements OnInit {

  legends = [
    {
      name: this.translateService.instant('shared.map-legend.your_position'),
      icon: Const.markerColor.user
    },
    {
      name: this.translateService.instant('shared.map-legend.no_energie'),
      icon: Const.markerColor.cut
    },
    {
      name: this.translateService.instant('shared.map-legend.your_no_energy'),
      icon: Const.markerColor.cutUser
    },
    {
      name: this.translateService.instant('shared.map-legend.energy_recovred'),
      icon:  Const.markerColor.recovred
    }
  ];
  showlegend = true;

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    log.debug('init');
  }

  showLegend() {
    if (this.showlegend) {
      this.showlegend = false;
    } else {
      this.showlegend = true;
    }
  }
}
