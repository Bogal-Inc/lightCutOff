export interface Position {
  latitude: number;
  longitude: number;
}

export interface Report {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  reportedAt: string;
  restoredAt: string;
  position: Position;
  acceptLangage: string;
  userAgent: string;
}
