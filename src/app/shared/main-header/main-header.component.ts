import { SimpleUser } from './../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  currentUser: SimpleUser;

  constructor(
    private angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.angularFireAuth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = { id: user.uid } as SimpleUser;
      }
    });
  }

}
