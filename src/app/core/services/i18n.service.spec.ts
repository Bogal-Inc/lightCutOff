import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { TranslateLoader, TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { HttpLoaderFactory } from 'src/app/app.module';

describe('I18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      TranslateModule.forRoot(),
    ],
  }));

  it('should be created', () => {
    const service: I18nService = TestBed.inject(I18nService);
    expect(service).toBeTruthy();
  });
});
