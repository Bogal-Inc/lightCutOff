import { Timestamp } from '@firebase/firestore-types';

export interface Position {
  lat: number;
  lng: number;
}

export class Duration {
  day: number;
  hour: number;
  min: number;
  sec: number;
}

/**
 * Statuts d'un signalement — schéma Njuka (`reports/{id}`, voir SCHEMA.md de l'app).
 */
export enum ReportSatus {
  ONGOING = 'ongoing',
  RESOLVED = 'resolved'
}

export enum ServiceType {
  ELECTRICITY = 'electricity',
  WATER = 'water'
}

/** Zone lisible issue du reverse-géocodage (GeoArea côté app). */
export interface GeoArea {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  neighborhood: string;
}

export interface Report {
  id?: string;
  userId?: string;
  authorUsername?: string | null;
  status: ReportSatus;
  /** unplanned (citoyen) | scheduled (opérateur) */
  type?: string;
  /** absent = electricity (rétro-compat app) */
  serviceType?: ServiceType;
  position: Position;
  location: GeoArea;
  description?: string | null;
  confirmationCount?: number;
  restorationCount?: number;
  impactRadiusM?: number;
  reportedAt: Date | Timestamp | any;
  resolvedAt?: Date | Timestamp | any;
  archivedAt?: Date | Timestamp | any;
  /**
   * Expiration silencieuse (cycle de vie v1.3.0 de l'app) : 48 h sans activité →
   * le cron `reportLifecycle` pose `autoExpiredAt` (+ `archivedAt`). Un signalement
   * expiré n'est JAMAIS « résolu » : il disparaît de l'affichage et ne compte dans
   * aucune stat de durée (une durée ne se calcule que sur `resolvedAt`).
   */
  autoExpiredAt?: Date | Timestamp | any;
  createdAt?: Date | Timestamp | any;
  updatedAt?: Date | Timestamp | any;
}

/** serviceType absent = électricité (même rétro-compat que l'app). */
export function reportServiceType(report: Report): ServiceType {
  return report.serviceType === ServiceType.WATER ? ServiceType.WATER : ServiceType.ELECTRICITY;
}
