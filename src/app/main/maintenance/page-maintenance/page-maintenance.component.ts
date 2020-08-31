import { Component, OnInit } from '@angular/core';
import {Const} from '../../../../environments/const';

@Component({
  selector: 'app-page-maintenance',
  templateUrl: './page-maintenance.component.html',
  styleUrls: ['./page-maintenance.component.scss']
})
export class PageMaintenanceComponent implements OnInit {
  appTitle = Const.app.title;

  constructor() { }

  ngOnInit(): void {
  }

}
