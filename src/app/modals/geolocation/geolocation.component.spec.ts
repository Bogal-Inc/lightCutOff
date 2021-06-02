import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationComponent } from './geolocation.component';
import {TranslateModule} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let fixture: ComponentFixture<GeolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [ GeolocationComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
