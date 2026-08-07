import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
      ],
    });
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
