import {Component, Input, OnInit} from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() card: {
    title: string;
    body: string;
    icon: string;
    style: string;
  };
  faSpinner = faSpinner;

  constructor() { }

  ngOnInit(): void {
  }

}
