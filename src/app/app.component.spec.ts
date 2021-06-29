import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {ToastrModule} from 'ngx-toastr';
import {Const} from '../environments/const';
import {NgcCookieConsentConfig, NgcCookieConsentModule, NgcCookieConsentService} from 'ngx-cookieconsent';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {I18nService} from '@Services/i18n.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HttpLoaderFactory} from './app.module';

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
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        // NgcCookieConsentModule.forRoot(cookieConfig),
        TranslateModule.forRoot({
          defaultLanguage: 'fr',
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          }
        }),
        HttpClientModule,
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        I18nService,
        TranslateService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let component = fixture.componentInstance;
    fixture.detectChanges();
    component.user = {
      email: null
    }
  });

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
