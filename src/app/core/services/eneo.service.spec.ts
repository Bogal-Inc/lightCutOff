import { TestBed } from '@angular/core/testing';

import { EneoService } from './eneo.service';

describe('EneoService', () => {
  let service: EneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
