import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  projectTitle = Const.app.title

  constructor() { }

  ngOnInit(): void {
  }

}
