import { TestBed } from '@angular/core/testing';

import { OfficialOutageService } from './official-outage.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('OfficialOutageService', () => {
  let service: OfficialOutageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
      ],
    });
    service = TestBed.inject(OfficialOutageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
