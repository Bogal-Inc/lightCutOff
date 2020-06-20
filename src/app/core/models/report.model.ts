import { Doc, defaultDoc } from './doc.model';


export interface Position {
  lat: number;
  lng: number;
}

export interface Report extends Doc {
  reportedAt: Date | firebase.firestore.Timestamp | any;
  recovredAt?: Date | firebase.firestore.Timestamp | any;
  position: Position;
  url?: string;
}

export const defaultReport = {
  ...defaultDoc,
  reportedAt: null,
  recovredAt: null,
  position: null,
  url: null,
} as Report;
