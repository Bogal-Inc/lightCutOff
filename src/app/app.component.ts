import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { DateTimeAdapter } from 'ng-pick-datetime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lightcutoff';

  constructor(
    private authService: AuthService,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('fr-FR');
    this.authService.anonymousAuth();
  }

  ngOnInit() { }
}
