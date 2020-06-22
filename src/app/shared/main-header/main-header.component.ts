import { AuthService } from '@Services/auth.service';
import { SimpleUser } from '@Models/user.model';
import { Component, OnInit } from '@angular/core';
import { Const } from 'src/environments/const';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  currentUser: SimpleUser;
  appTitle = Const.app.title;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }
}
