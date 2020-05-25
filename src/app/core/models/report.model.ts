import { firestore } from 'firebase';


export interface Position {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  deletedAt: firestore.Timestamp;
  reportedAt: firestore.Timestamp;
  restoredAt: firestore.Timestamp;
  position: Position;
  acceptLangage: string;
  userAgent: string;
}
