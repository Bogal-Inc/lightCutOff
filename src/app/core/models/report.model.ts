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

export interface Report extends Doc {
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
  addresses: null,
  country: null,
  city: null,
  reportedAt: null,
  recovredAt: null,
  position: null,
  url: null,
} as Report;
