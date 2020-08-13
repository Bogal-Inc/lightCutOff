import { TestBed } from '@angular/core/testing';

import { MetaService } from './meta.service';
import {TranslateModule} from '@ngx-translate/core';

describe('MetaService', () => {
  let service: MetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ]
    });
    service = TestBed.inject(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
