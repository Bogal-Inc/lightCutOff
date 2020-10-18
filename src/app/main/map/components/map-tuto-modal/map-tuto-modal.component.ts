import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Const} from '../../../../../environments/const';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('tuto-modal.component');

@Component({
  selector: 'app-tuto-modal',
  templateUrl: './map-tuto-modal.component.html',
  styleUrls: ['./map-tuto-modal.component.scss'],
})
export class MapTutoModalComponent implements OnInit {
  readonly projectTitle = Const.app.title;
  readonly localStorageNameTutoPass = 'tutoPassed';
  currentStep = 0;
  tutoPassed: any;
  nextStep = [
    {
      status: true,
      title: this.translateService.instant('main.tuto-modal.step_1_header')
    },
    {
      status: false,
      title: this.translateService.instant('main.tuto-modal.step_2_header')
    },
    {
      status: false,
      title: this.translateService.instant('main.tuto-modal.step_2_header')
    },
    {
      status: false,
      title: this.translateService.instant('main.tuto-modal.step_3_header')
    },
    {
      status: false,
      title: this.translateService.instant('main.tuto-modal.step_4_header')
    }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private analytics: AngularFireAnalytics,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    log.debug('init');

    if (localStorage.getItem(this.localStorageNameTutoPass) === null){
      localStorage.setItem(this.localStorageNameTutoPass, '0');
    }
  }

  tutoNext() {
    this.analytics.logEvent('tuto_modal_next', {
      step: this.currentStep
    });

    this.nextStep[this.currentStep].status = false;
    this.currentStep++;
    this.nextStep[this.currentStep].status = true;
  }

  tutoFinish() {
    return this.currentStep === (this.nextStep.length - 1);
  }

  tutoEnd() {
    this.analytics.logEvent('tutorial_complete');

    localStorage.setItem(this.localStorageNameTutoPass, '1');
    this.activeModal.close();
  }
}
