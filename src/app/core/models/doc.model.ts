import { SimpleUser } from './user.model';
import { Timestamp } from '@firebase/firestore-types';

export interface Doc {
  id?: string;
  _createdAt?: Date | Timestamp | any;
  _createdBy?: SimpleUser;
  _updatedAt?: Date | Timestamp | any;
  _updatedBy?: SimpleUser;
  _deletedAt?: Date | Timestamp | any;
  _deletedBy?: SimpleUser;
  _isDelete?: boolean;
}

export const defaultDoc = {
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
  _isDelete: false
} as Doc;
