import { TestBed } from '@angular/core/testing';

import { isPubliclyVisible, ReportService } from './report.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { Report, ReportSatus } from '@Models/report.model';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
    });
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isPubliclyVisible', () => {
    const baseReport = { status: ReportSatus.ONGOING, reportedAt: new Date() } as Report;

    it('accepte un signalement actif', () => {
      expect(isPubliclyVisible(baseReport)).toBeTrue();
    });

    it('écarte un signalement archivé (soft-delete)', () => {
      expect(isPubliclyVisible({ ...baseReport, archivedAt: new Date() })).toBeFalse();
    });

    it('écarte un signalement expiré, même sans archivedAt (contrat découplé)', () => {
      expect(isPubliclyVisible({ ...baseReport, autoExpiredAt: new Date() })).toBeFalse();
    });
  });
});
