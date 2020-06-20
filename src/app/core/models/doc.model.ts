import { SimpleUser } from './user.model';

export interface Doc {
  id?: string;
  _createdAt?: Date | firebase.firestore.Timestamp | any;
  _createdBy?: SimpleUser;
  _updatedAt?: Date | firebase.firestore.Timestamp | any;
  _updatedBy?: SimpleUser;
  _deletedAt?: Date | firebase.firestore.Timestamp | any;
  _deletedBy?: SimpleUser;
  _isDelete: boolean;
}

export const defaultDoc = {
  id:  null,
  _createdAt:  null,
  _createdBy: {
    id:  null
  },
  _updatedAt:  null,
  _updatedBy: {
    id:  null
  },
  _deletedAt:  null,
  _deletedBy: {
    id:  null
  },
  _isDelete: false,
} as Doc;
