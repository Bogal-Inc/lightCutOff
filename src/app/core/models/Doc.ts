import { SimpleUser } from './user';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';

export interface Doc {
  id?: string;
  _createdAt?: Date | any;
  _createdBy?: SimpleUser;
  _updatedAt?: Date | any;
  _updatedBy?: SimpleUser;
  _deletedAt?: Date | any;
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
