import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  projectTitle = Const.app.title;
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
  }

}
