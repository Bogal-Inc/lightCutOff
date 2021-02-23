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
    // TODO: préparer des message pour des situations d'urgence
    /*this.options = {
      type: 'danger',
      message_en: 'Actuellement nous subissons une defaillance du système sur le navigateur chrome. Nous travaillons activement à résou',
      message_fr: 'Actuellement nous subissons une defaillance du système sur le navigateur chrome. Nous travaillons activement à résou' ,
    };*/
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
