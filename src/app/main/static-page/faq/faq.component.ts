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
  /** Clés i18n des questions/réponses (core.faq.qN / core.faq.aN). */
  readonly faqItems = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() { }

  ngOnInit(): void {
  }

}
