import { Const } from 'src/environments/const';
import { ToastrService } from 'ngx-toastr';
import { MailService } from './../../core/services/mail.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private mailService: MailService,
    private toastService: ToastrService,
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
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSendMail() {
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
            this.toastService.success('Message envoyé');
        } else {
          this.toastService.error('Votre message n\'a pas été envoyé');
        }
        this.submitted = false;
        this.contactUsForm.reset();
      }
    );
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
