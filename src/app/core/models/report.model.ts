import { Doc, defaultDoc } from './doc.model';


export interface Position {
  lat: number;
  lng: number;
}

export interface Address {
  label: string;
  types: string[];
  placeId: string;
}

export enum ReportSatus {
  CUT = 'cut',
  RECOVRED = 'recovred'
}

export interface Report extends Doc {
  status: ReportSatus;
  addresses: Address[];
  country: string;
  city: string;
  reportedAt: Date | firebase.firestore.Timestamp | any;
  recovredAt?: Date | firebase.firestore.Timestamp | any;
  position: Position;
  url?: string;
}

export const defaultReport = {
  ...defaultDoc,
  status: ReportSatus.CUT,
  addresses: null,
  country: null,
  city: null,
  reportedAt: null,
  recovredAt: null,
  position: null,
  url: null,
} as Report;
