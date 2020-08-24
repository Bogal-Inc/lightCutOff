import { Doc, defaultDoc } from './doc.model';


export interface Position {
  lat: number;
  lng: number;
}

export interface GoogleInfosLoaction {
  label: string;
  types: string[];
}

export interface Location {
  country: string;
  region: string;
  department: string;
  city: string;
  district: string;
  googleInfos: GoogleInfosLoaction[];
}

export enum ReportSatus {
  CUT = 'cut',
  RECOVRED = 'recovred'
}

export interface Report extends Doc {
  status: ReportSatus;
  location: Location;
  reportedAt: Date | firebase.firestore.Timestamp | any;
  recovredAt?: Date | firebase.firestore.Timestamp | any;
  position: Position;
  url?: string;
}

export const defaultReport = {
  ...defaultDoc,
  status: ReportSatus.CUT,
  location: null,
  country: null,
  city: null,
  reportedAt: null,
  recovredAt: null,
  position: null,
  url: null,
} as Report;
