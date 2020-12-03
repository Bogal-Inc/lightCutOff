import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  options: any;

  constructor() { }

  ngOnInit(): void {
    /*this.options = {
      message: '<b>Hello</b> world',
      type: 'danger'
    };*/
  }
}
