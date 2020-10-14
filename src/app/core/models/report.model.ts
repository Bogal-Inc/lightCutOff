import { Doc, defaultDoc } from './doc.model';


export interface Position {
  lat: number;
  lng: number;
}


export interface Location {
  country: string;
  region: string;
  department: string;
  city: string;
  neighborhood: string;
  addresses: any[];
  others: any[];
  googleData: any[];
}

export enum ReportSatus {
  CUT = 'cut',
  CUT_OWNER = 'cut_owner',
  CUT_COMPLETED = 'cut_completed'
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
  location: {
    department: null,
    neighborhood: null,
    addresses: [],
    others: []
  },
  reportedAt: null,
  recovredAt: null,
  position: null,
  url: null,
} as Report;
