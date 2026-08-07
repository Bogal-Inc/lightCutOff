import {Component, Input, OnInit} from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: false,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() card: {
    title: string;
    body: string;
    icon: any;
    style: string;
  };
  faSpinner = faSpinner;

  get style_text(): string {
    const color =  this.card.style.split('-')[2];
    return 'text-' + color;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
