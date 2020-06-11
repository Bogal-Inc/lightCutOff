import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss']
})
export class MapLegendComponent implements OnInit {

  legends = [
    {
      name: 'Votre position',
      icon: environment.markerColor.user
    },
    {
      name: 'Pas d\'électricité',
      icon: environment.markerColor.cut
    },
    {
      name: 'Electricité remise',
      icon: environment.markerColor.recovred
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
