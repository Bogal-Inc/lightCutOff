import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MailService} from '../../core/services-firebase/mail.service';
import {ToastrService} from 'ngx-toastr';
import {I18nService} from '@Services/i18n.service';
import {Subject} from 'rxjs';
import {Const} from '../../../environments/const';
import {takeUntil} from 'rxjs/operators';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';

const log = new Logger('contactus.component');

@Component({
  standalone: false,
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  contactUsForm: FormGroup;
  submitted = false;
  appTitle = Const.app.title;
  currentLang: string;

  constructor(
    private formBuilder: FormBuilder,
    private mailService: MailService,
    private toastService: ToastrService,
    private i18nService: I18nService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.initContactUsForm();
    this.currentLang = this.i18nService.language;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
            log.debug('email sended');
            this.analytics.logEvent('send_email');

            this.toastService.success('Message envoyé');
          } else {
            log.error('error send mail', data);
            this.toastService.error('Votre message n\'a pas été envoyé');
          }
          this.submitted = false;
          this.contactUsForm.reset();
        },
        err => {
          log.error('email no send', err);
        }
      );
  }

}
