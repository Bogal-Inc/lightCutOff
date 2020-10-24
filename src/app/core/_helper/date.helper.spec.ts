import { TestBed } from '@angular/core/testing';
import {compareDate, getDuration, durationToString, fromDate} from '@Helpers/date.helper';

describe('DateHelper', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
  });

  it('#compareDate should be compare 2 dates', () => {
    const date1 = new Date();
    const date2 = new Date('2019-01-01');
    const result = compareDate(date1, date2);

    expect(result).toBeTrue();
  });

  it('#getDuration should be give a duration between 2 dates', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2020-01-02');
    const result = getDuration(date1, date2);

    expect(result.day).toEqual(1);
  });

  it('#fromDate should be convrt date to firebase date', () => {
    const date = new Date('2020-01-01');
    const result = fromDate(date);

    expect(result.seconds).toEqual(1577836800);
    expect(result.nanoseconds).toEqual(0);
  });

  it('#durationToString should be give day and hour', () => {
    const date1 = new Date('2020-01-01 01:10:00');
    const date2 = new Date('2020-01-02 10:20:01');
    const duration = getDuration(date1, date2);

    const result = durationToString(duration);

    expect(result).toEqual('1j 9h');
  });

  it('#durationToString should be give min', () => {
    const date1 = new Date('2020-01-01 01:10:00');
    const date2 = new Date('2020-01-01 10:20:01');
    const duration = getDuration(date1, date2);

    const result = durationToString(duration);

    expect(result).toEqual('9h');
  });
});
