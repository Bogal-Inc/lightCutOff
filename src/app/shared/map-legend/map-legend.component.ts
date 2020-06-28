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
      name: 'Votre position',
      icon: Const.markerColor.user
    },
    {
      name: 'Pas d\'électricité',
      icon: Const.markerColor.cut
    },
    {
      name: 'Votre rapport pas fermé',
      icon: Const.markerColor.cutUser
    },
    {
      name: 'Electricité remise',
      icon:  Const.markerColor.recovred
    }
  ];

  constructor() { }

  ngOnInit(): void {
    log.debug('init');
  }

}
