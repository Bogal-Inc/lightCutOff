import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { TranslateLoader, TranslateCompiler, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

describe('I18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      TranslateModule.forRoot({
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
    ]
  }));

  it('should be created', () => {
    const service: I18nService = TestBed.get(I18nService);
    expect(service).toBeTruthy();
  });
});
