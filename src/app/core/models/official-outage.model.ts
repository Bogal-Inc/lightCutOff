import { Timestamp } from '@firebase/firestore-types';
import { ServiceType } from '@Models/report.model';

/**
 * Coupure officielle planifiée (programme SOCADEL, ex-Eneo), collection `official_outages`
 * — miroir du modèle Dart de l'app (`lib/models/official_outage.dart`).
 * Alimentée par la CF `ingestEneoOutages` (cron quotidien) ; écriture client
 * interdite, lecture si connecté (anonyme compris). Pas de coordonnées GPS :
 * localisation annoncée en texte (region / ville / quartier).
 */
export interface OfficialOutage {
  id?: string;
  provider: string;
  country: string;
  region: string;
  ville: string;
  quartier: string;
  /** motif annoncé (« observations » du programme) */
  reason: string;
  /** YYYY-MM-DD (date locale du fournisseur, Africa/Douala) */
  progDate: string;
  /** HH:MM locales (affichage) */
  startTime: string;
  endTime: string;
  startsAt?: Date | Timestamp | any;
  endsAt?: Date | Timestamp | any;
  /** absent = electricity (seul l'opérateur élec — SOCADEL, flux technique « eneo » — est ingéré) */
  serviceType?: ServiceType;
}

/** Date du jour au format YYYY-MM-DD (comparaison lexicale = chronologique). */
export function todayYmd(now: Date = new Date()): string {
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
}

/**
 * Coupures à venir (aujourd'hui compris), triées par date puis heure de début
 * — même logique client que l'app (requête mono-champ, filtre/tri locaux).
 */
export function upcomingOfficialOutages(outages: OfficialOutage[], today: string = todayYmd()): OfficialOutage[] {
  return outages
    .filter(outage => outage.progDate >= today)
    .sort((a, b) => (a.progDate + a.startTime).localeCompare(b.progDate + b.startTime));
}

/** Régions distinctes (triées) présentes dans la liste — alimente le filtre. */
export function officialOutageRegions(outages: OfficialOutage[]): string[] {
  return [...new Set(outages.map(outage => outage.region).filter(region => !!region))].sort();
}

/** Filtre région + recherche texte (quartier / ville), insensible à la casse. */
export function filterOfficialOutages(
  outages: OfficialOutage[],
  region: string | null,
  query: string
): OfficialOutage[] {
  const normalizedQuery = query.trim().toLowerCase();
  return outages.filter(outage => {
    if (region && outage.region !== region) {
      return false;
    }
    if (normalizedQuery) {
      return `${outage.quartier} ${outage.ville}`.toLowerCase().includes(normalizedQuery);
    }
    return true;
  });
}
