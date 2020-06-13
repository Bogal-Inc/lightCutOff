import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lightcutoff';

  constructor(
    private authService: AuthService,
  ) {
    this.authService.anonymousAuth();
  }

  ngOnInit() { }
}
