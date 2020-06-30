import { I18nService } from '@Services/i18n.service';
import { Const } from 'src/environments/const';
import { ToastrService } from 'ngx-toastr';
import { MailService } from '@Services/mail.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Logger } from '@Services/logger.service';

const log = new Logger('loading.component');

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class MainFooterComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  closeResult = '';
  contactUsForm: FormGroup;
  submitted = false;
  appTitle = Const.app.title;
  currentLang: string;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private mailService: MailService,
    private toastService: ToastrService,
    private i18nService: I18nService,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.initContactUsForm();
    this.currentLang = this.i18nService.language;
    log.debug('init');
  }

  open(content) {
    log.debug('open close');
    this.modalService.open(content).result.then((result) => {
      log.debug('open modal');
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      log.error('close modal');
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSendMail() {
    log.debug('onSendMail call');
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactUsForm.invalid) {
      return;
    }

    this.mailService.sendMail(this.contactUsForm.value)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      data => {
        if (data === 'Sended'){
            log.debug('send mail');
            this.toastService.success('Message envoyé');
        } else {
          log.error('error send mail');
          this.toastService.error('Votre message n\'a pas été envoyé');
        }
        this.submitted = false;
        this.contactUsForm.reset();
      }
    );
  }

  toggleLang() {
    log.debug('call toggleLang');
    if (this.i18nService.language === Const.app.lang.fr){
      log.debug('active lang en');
      this.i18nService.language = Const.app.lang.en;
      this.currentLang = Const.app.lang.en;
    } else {
      log.debug('active lang Fr');
      this.i18nService.language = Const.app.lang.fr;
      this.currentLang = Const.app.lang.fr;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.contactUsForm.controls; }

  private initContactUsForm() {
    this.contactUsForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
