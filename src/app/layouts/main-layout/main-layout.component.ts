import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {InternetService} from '@Services/internet.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  options: any;

  constructor(
    private router: Router,
    private internetService: InternetService
  ) { }

  ngOnInit(): void {
    this.options = {
      type: 'warning',
      message_en: '<strong>Lightcutoff</strong> team is proud to present its best wishes for the year <strong>2021</strong>.',
      message_fr: 'L\'équipe <strong>Lightcutoff</strong> est fiert de vous présentez ses meilleurs voeux pour l\'année <strong>2021</strong>.',
    };
    this.isOnlineStatus();
  }

  isGlobalMessage() {
    return this.options?.message_en !== undefined && this.options?.message_fr !== undefined;
  }

  isFixedTop(){
    const url = this.router.url;
    const route2 = url.split('/')[1];
    return route2 === '';
  }

  isOnlineStatus() {
    this.internetService.start();
    this.internetService.behaviorSubjectObservable$.subscribe(online => {
      if (!online) {
        this.options = {
          type: 'danger',
          message_en: 'It looks like you are no longer logged in. Check your internet connection',
          message_fr: 'Il semblerais que vous n\'êtes plus connecté. Vérifier votre connexion internet',
        };
      }
    });
  }
}
