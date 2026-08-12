import { Report, ReportSatus, ServiceType } from '@Models/report.model';
import { computeReportStats, formatMinutes } from './report-stats';

describe('computeReportStats', () => {
  const now = new Date(2026, 7, 12, 12, 0); // 12 août 2026
  const report = (over: Partial<Report>): Report => ({
    status: ReportSatus.ONGOING,
    reportedAt: new Date(2026, 7, 12, 8, 0),
    position: { lat: 0, lng: 0 },
    location: { country: 'Cameroun', countryCode: 'CM', region: 'Centre', city: 'Yaoundé', neighborhood: 'Bastos' },
    ...over
  } as Report);

  it('ventile les états (expiré prime sur archivé) et les services', () => {
    const stats = computeReportStats([
      report({}),
      report({ status: ReportSatus.RESOLVED, resolvedAt: new Date(2026, 7, 12, 10, 0) }),
      report({ archivedAt: new Date(), autoExpiredAt: new Date() }),
      report({ archivedAt: new Date() }),
      report({ serviceType: ServiceType.WATER })
    ], now);
    expect(stats.total).toBe(5);
    expect(stats.ongoing).toBe(2);
    expect(stats.resolved).toBe(1);
    expect(stats.expired).toBe(1);
    expect(stats.archived).toBe(1);
    expect(stats.water).toBe(1);
    expect(stats.electricity).toBe(4);
  });

  it('compte le mois/jour et la durée moyenne des seules coupures résolues', () => {
    const stats = computeReportStats([
      report({ status: ReportSatus.RESOLVED, resolvedAt: new Date(2026, 7, 12, 10, 30) }), // 2 h 30
      report({ reportedAt: new Date(2026, 6, 2) }),                                        // autre mois
      // expiré avec resolvedAt fantôme : ne doit PAS compter dans la durée
      report({ autoExpiredAt: new Date(), resolvedAt: new Date(2026, 7, 12, 20, 0), archivedAt: new Date() })
    ], now);
    expect(stats.thisMonth).toBe(2);
    expect(stats.today).toBe(2);
    expect(stats.avgResolutionMinutes).toBe(150);
  });

  it('classe les villes par volume', () => {
    const stats = computeReportStats([
      report({}), report({}),
      report({ location: { country: 'Cameroun', countryCode: 'CM', region: 'Littoral', city: 'Douala', neighborhood: 'Akwa' } })
    ], now);
    expect(stats.topCities[0]).toEqual({ city: 'Yaoundé', count: 2 });
    expect(stats.topCities[1]).toEqual({ city: 'Douala', count: 1 });
  });
});

describe('formatMinutes', () => {
  it('formate en h/min', () => {
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(150)).toBe('2 h 30 min');
    expect(formatMinutes(120)).toBe('2 h');
  });
});
