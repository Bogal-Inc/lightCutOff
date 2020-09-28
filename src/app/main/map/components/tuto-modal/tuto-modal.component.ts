import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Const} from '../../../../../environments/const';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tuto-modal',
  templateUrl: './tuto-modal.component.html',
  styleUrls: ['./tuto-modal.component.scss'],
})
export class TutoModalComponent implements OnInit {
  readonly projectTitle = Const.app.title;
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
  currentStep = 0;
  tutoPassed: any;

  constructor(
    public activeModal: NgbActiveModal,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('tutoPassed') === null){
      localStorage.setItem('tutoPassed', '0');
    }
  }

  tutoNext() {
    this.nextStep[this.currentStep].status = false;
    this.currentStep++;
    this.nextStep[this.currentStep].status = true;
  }

  tutoFinish() {
    return this.currentStep === (this.nextStep.length - 1);
  }

  tutoEnd() {
    localStorage.setItem('tutoPassed', '1');
    this.activeModal.close();
  }
}
