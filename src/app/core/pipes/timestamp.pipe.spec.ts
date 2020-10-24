import { TestBed } from '@angular/core/testing';

import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

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

    expect(result).toBe('Jan 01, 2020, 10:09:00 AM');
  });
});
