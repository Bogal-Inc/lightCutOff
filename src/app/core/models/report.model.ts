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
  createdAt?: Date | Timestamp | any;
  updatedAt?: Date | Timestamp | any;
}

/** serviceType absent = électricité (même rétro-compat que l'app). */
export function reportServiceType(report: Report): ServiceType {
  return report.serviceType === ServiceType.WATER ? ServiceType.WATER : ServiceType.ELECTRICITY;
}
