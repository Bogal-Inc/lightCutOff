import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services-firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Logger} from '@Services/logger.service';
import {MustMatch} from '@Helpers/must-match.validator';
import {User} from '@Models/user.model';

const log = new Logger('register-form.component');

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  @Input() user;
  @Output() submited = new EventEmitter<User>();
  form: FormGroup;
  submitted = false;
  successed = false;
  cguError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private angularFireAnalytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');

    this.initForm();
  }

  private initForm() {
    if (this.user) {
      this.form = this.formBuilder.group({
        id: [this.user.id, [Validators.required]],
        firstName: [this.user.firstName],
        lastName: [this.user.lastName],
        phoneNumber: [this.user.phoneNumber],
        gender: [this.user.gender],
        email: [this.user.email]
      });
    } else {
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        // password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
        confirmPassword: ['', Validators.required],
        // accept: [false]
      }, { validator: MustMatch('password', 'confirmPassword')});
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    let dataForm;

    if (this.user?.email) {
      dataForm = {
        id: this.form.get('id').value,
        firstName: this.form.get('firstName').value,
        lastName: this.form.get('lastName').value,
        gender: this.form.get('gender').value,
        phoneNumber: this.form.get('phoneNumber').value,
        email: this.form.get('email').value,
      };
    } else {
      dataForm = {
        email: this.form.get('email').value,
        password: this.form.get('password').value
      };
    }

    this.submited.emit(dataForm);
  }
}
