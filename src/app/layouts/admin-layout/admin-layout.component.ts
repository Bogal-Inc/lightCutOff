import { Component, OnInit } from '@angular/core';
import {isMobile} from '@Helpers/mobile-confirm.helper';

@Component({
  standalone: false,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isMobile: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isMobile = isMobile();
  }

}
