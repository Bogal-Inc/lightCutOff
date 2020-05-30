import { firestore } from 'firebase';


export interface Position {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  reportedAt: Date;
  recovredAt: Date;
  position: Position;
  url?: string;
}
