import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Const} from '../../../../../environments/const';
import {TranslateService} from '@ngx-translate/core';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('tuto-modal.component');

@Component({
  selector: 'app-tuto-modal',
  templateUrl: './tuto-modal.component.html',
  styleUrls: ['./tuto-modal.component.scss'],
})
export class TutoModalComponent implements OnInit {
  readonly projectTitle = Const.app.title;
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

    if (localStorage.getItem('tutoPassed') === null){
      localStorage.setItem('tutoPassed', '0');
    }
  }

  tutoNext() {
    this.analytics.logEvent('tuto_pass_next');

    this.nextStep[this.currentStep].status = false;
    this.currentStep++;
    this.nextStep[this.currentStep].status = true;
  }

  tutoFinish() {
    return this.currentStep === (this.nextStep.length - 1);
  }

  tutoEnd() {
    this.analytics.logEvent('tuto_pass_end');

    localStorage.setItem('tutoPassed', '1');
    this.activeModal.close();
  }
}
