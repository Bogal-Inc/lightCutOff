import { Const } from 'src/environments/const';
/** Angular Imports */
import { Injectable } from '@angular/core';

/** Translation Imports */
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

/** Custom Services */
import {Logger} from './logger.service';

/** Other Imports */
import { includes } from 'lodash';
import * as frFR from '../../../assets/i18n/fr.json';


/** Initialize Logger */
const log = new Logger('I18nService');

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 */
export function extract(s: string) {
  return s;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Key to store current language of application in local storage. */
  private languageStorageKey = Const.app.title + 'XLanguage';

  defaultLanguage: string;
  supportedLanguages: string[];

  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('fr', frFR);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(this.languageStorageKey, event.lang);
    });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   */
  set language(language: string) {
    language =
      language ||
      localStorage.getItem(this.languageStorageKey) ||
      this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = includes(this.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      // language = language.split('-')[0];
      language =
        this.supportedLanguages.find(supportedLanguage =>
          supportedLanguage.startsWith(language)
        ) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   */
  get language(): string {
    return this.translateService.currentLang;
  }
}
