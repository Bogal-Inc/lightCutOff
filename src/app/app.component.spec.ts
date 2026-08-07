import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MessagingComponent } from './modals/messaging/messaging.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {ToastrModule} from 'ngx-toastr';
import {Const} from '../environments/const';
import {provideHttpClient} from '@angular/common/http';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {I18nService} from '@Services/i18n.service';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {TranslateHttpLoader, provideTranslateHttpLoader} from '@ngx-translate/http-loader';

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
            useClass: TranslateHttpLoader
          }
        }),
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
      ],
      declarations: [
        AppComponent,
        MessagingComponent
      ],
      providers: [
        I18nService,
        TranslateService,
        provideHttpClient(),
        provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
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
