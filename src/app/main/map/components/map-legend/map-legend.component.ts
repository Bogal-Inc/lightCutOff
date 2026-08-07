import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';
import { Logger } from '@Services/logger.service';
import { isMobile } from '@Helpers/mobile-confirm.helper';

const log = new Logger('map-legend.component');

@Component({
  standalone: false,
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
      name: this.translateService.instant('shared.map-legend.electricity_cut'),
      icon: Const.markerColor.electricity
    },
    {
      name: this.translateService.instant('shared.map-legend.water_cut'),
      icon: Const.markerColor.water
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

    this.showlegend = !isMobile();
  }

  toggleShowLegend() {
    if (this.showlegend) {
      this.showlegend = false;
    } else {
      this.showlegend = true;
    }
  }
}
