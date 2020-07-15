import { Component, OnInit } from '@angular/core';
import {isMobile} from '@Helpers/mobile-confirm.helper';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isMobiled() {
    return isMobile();
  }

}
