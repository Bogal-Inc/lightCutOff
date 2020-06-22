import { TestBed } from '@angular/core/testing';

import { MailService } from './mail.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';

describe('MailService', () => {
  let service: MailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
    });
    service = TestBed.inject(MailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
