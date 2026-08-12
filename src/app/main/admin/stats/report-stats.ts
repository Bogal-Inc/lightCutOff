import { Report, ReportSatus, ServiceType, reportServiceType } from '@Models/report.model';

/**
 * Agrégats de la page Statistiques admin — fonctions PURES (testées).
 * Règle d'hygiène (roadmap P0) : une durée ne se calcule QUE sur `resolvedAt`,
 * jamais sur `autoExpiredAt` (qui mesure le silence, pas la coupure).
 */
export interface ReportStats {
  total: number;
  ongoing: number;
  resolved: number;
  expired: number;
  archived: number;
  electricity: number;
  water: number;
  thisMonth: number;
  today: number;
  /** durée moyenne (minutes) des coupures résolues — null si aucune */
  avgResolutionMinutes: number | null;
  /** top villes par nombre de signalements, décroissant */
  topCities: { city: string; count: number }[];
}

const toDate = (value: any): Date | null => {
  if (!value) {
    return null;
  }
  return typeof value.toDate === 'function' ? value.toDate() : new Date(value);
};

export function computeReportStats(reports: Report[], now: Date = new Date()): ReportStats {
  const stats: ReportStats = {
    total: reports.length,
    ongoing: 0, resolved: 0, expired: 0, archived: 0,
    electricity: 0, water: 0,
    thisMonth: 0, today: 0,
    avgResolutionMinutes: null,
    topCities: []
  };

  const cities = new Map<string, number>();
  let resolutionTotalMs = 0;
  let resolutionCount = 0;

  for (const report of reports) {
    if (report.autoExpiredAt) {
      stats.expired++;
    } else if (report.archivedAt) {
      stats.archived++;
    } else if (report.status === ReportSatus.RESOLVED) {
      stats.resolved++;
    } else {
      stats.ongoing++;
    }

    if (reportServiceType(report) === ServiceType.WATER) {
      stats.water++;
    } else {
      stats.electricity++;
    }

    const reportedAt = toDate(report.reportedAt);
    if (reportedAt) {
      if (reportedAt.getFullYear() === now.getFullYear() && reportedAt.getMonth() === now.getMonth()) {
        stats.thisMonth++;
        if (reportedAt.getDate() === now.getDate()) {
          stats.today++;
        }
      }
      // durée : uniquement résolu (jamais expiré), et jamais négative
      const resolvedAt = !report.autoExpiredAt ? toDate(report.resolvedAt) : null;
      if (resolvedAt && resolvedAt.getTime() >= reportedAt.getTime()) {
        resolutionTotalMs += resolvedAt.getTime() - reportedAt.getTime();
        resolutionCount++;
      }
    }

    const city = report.location?.city?.trim();
    if (city) {
      cities.set(city, (cities.get(city) ?? 0) + 1);
    }
  }

  if (resolutionCount > 0) {
    stats.avgResolutionMinutes = Math.round(resolutionTotalMs / resolutionCount / 60000);
  }
  stats.topCities = [...cities.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return stats;
}

/** « 5 h 20 min » depuis des minutes — affichage humain. */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  return mins > 0 ? `${hours} h ${mins.toString().padStart(2, '0')} min` : `${hours} h`;
}
