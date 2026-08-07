import { Component, OnInit } from '@angular/core';
import {Const} from '../../../../environments/const';

@Component({
  standalone: false,
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  readonly projectTitle = Const.app.title;

  constructor() { }

  ngOnInit(): void {
  }

}
