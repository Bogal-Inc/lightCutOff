import { Doc, defaultDoc } from './Doc';


export interface Position {
  lat: number;
  lng: number;
}

export interface Report extends Doc {
  reportedAt: Date | any;
  recovredAt?: Date | any;
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
