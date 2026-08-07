import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessagingComponent } from './messaging.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../environments/environment';
import {MessagingService} from '../../core/services-firebase';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {ToastrModule} from 'ngx-toastr';
import {AngularFireMessaging, AngularFireMessagingModule} from '@angular/fire/compat/messaging';

describe('messagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireMessagingModule,
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
        HttpClientModule
      ],
      declarations: [ MessagingComponent ],
      providers: [NgbActiveModal, MessagingService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
