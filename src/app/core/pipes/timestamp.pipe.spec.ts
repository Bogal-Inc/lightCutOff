import { TestBed } from '@angular/core/testing';

import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import {I18nService} from '@Services/i18n.service';

describe('TimestampPipe', () => {
  let pipe: TimestampPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimestampPipe
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        TimestampPipe
      ]
    });
    pipe = TestBed.inject(TimestampPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should be transform date', () => {
    const date = new Date('2020-01-01 10:09:00');
    const result = pipe.transform(date);

    const expected = new Intl.DateTimeFormat(TestBed.inject(I18nService).language, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
    expect(result).toBe(expected);
  });
});
