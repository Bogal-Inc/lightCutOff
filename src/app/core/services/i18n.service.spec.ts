import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot(),
      ]
    });
    service = TestBed.inject(I18nService);
    service.init('fr', ['fr', 'en']);
  });

  it ('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setLanguage should return new langage', () => {
    service.init('fr', ['fr', 'en']);
    service.language = 'en';
    const defaultLang = service.language;

    expect(defaultLang).toBe('en');
  });
});
