import { TestBed } from '@angular/core/testing';

import { InternetService } from './internet.service';

describe('InternetService', () => {
  let service: InternetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
