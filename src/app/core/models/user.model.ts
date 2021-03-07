import { Doc, defaultDoc } from './doc.model';

export enum Gender {
  MAN = 'man',
  WOMAN = 'woman'
}

export interface SimpleUser {
  id: string;
}

// TODO: il reste encore des roles a determiner
export interface Role {
  admin?: boolean;
}

export interface User  extends Doc {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: null;
  photoURL?: string;
  gender?: Gender;
  birthday?: Date | firebase.firestore.Timestamp | any;
  roles?: Role;
  messagingToken?: string;
  isMessagingToken: boolean;
}

export const defaultUser = {
  ...defaultDoc,
  email: null,
  firstName: null,
  lastName: null,
  displayName: null,
  phoneNumber: null,
  gender: null,
  photoURL: null,
  roles: {
    admin: false
  },
  messagingToken: null,
  isMessagingToken: false
} as User;
