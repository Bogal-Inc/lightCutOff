import { Report, ReportSatus } from '@Models/report.model';
import { moderationState } from './admin-reports.component';

describe('moderationState', () => {
  const base = { status: ReportSatus.ONGOING, reportedAt: new Date() } as Report;

  it('en cours / rétabli selon le statut', () => {
    expect(moderationState(base)).toBe('ongoing');
    expect(moderationState({ ...base, status: ReportSatus.RESOLVED })).toBe('resolved');
  });

  it('expiré prime sur archivé (le cron pose les deux champs)', () => {
    expect(moderationState({ ...base, archivedAt: new Date(), autoExpiredAt: new Date() })).toBe('expired');
  });

  it('archivé seul = archivage manuel', () => {
    expect(moderationState({ ...base, archivedAt: new Date() })).toBe('archived');
  });
});
