import { TranslateModule } from '@ngx-translate/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {ToastrModule} from 'ngx-toastr';
import {Const} from '../environments/const';
import {NgcCookieConsentConfig, NgcCookieConsentModule, NgcCookieConsentService} from 'ngx-cookieconsent';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
    domain: 'localhost'
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgcCookieConsentModule.forRoot(cookieConfig),
        TranslateModule.forRoot(),
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lightcutoff'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual(Const.app.title);
  });
});
