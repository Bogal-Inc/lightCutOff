import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingComponent } from './messaging.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {MessagingService} from '../../core/services-firebase';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {ToastrModule} from 'ngx-toastr';
import {AngularFireMessaging, AngularFireMessagingModule} from '@angular/fire/messaging';

describe('messagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;

  beforeEach(async(() => {
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
