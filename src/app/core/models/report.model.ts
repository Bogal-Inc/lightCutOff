import { Doc, defaultDoc } from './doc.model';
import {ILocationModel, locationModel} from '@Models/location.model';

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

export enum ReportSatus {
  CUT = 'cut',
  CUT_OWNER = 'cut_owner',
  CUT_COMPLETED = 'cut_completed'
}

export interface Report extends Doc {
  status: ReportSatus;
  location: ILocationModel;
  reportedAt: Date | firebase.firestore.Timestamp | any;
  recovredAt?: Date | firebase.firestore.Timestamp | any;
  position: Position;
}

export const defaultReport = {
  ...defaultDoc,
  status: ReportSatus.CUT,
  location: locationModel,
  reportedAt: null,
  recovredAt: null,
  position: null
} as Report;
