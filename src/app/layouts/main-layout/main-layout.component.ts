import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  options: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  isGlobalMessage() {
    return this.options?.message_en !== undefined && this.options?.message_fr !== undefined;
  }

  isFixedTop(){
    const url = this.router.url;
    const route2 = url.split('/')[1];
    return route2 === '';
  }
}
