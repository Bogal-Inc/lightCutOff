import { Doc } from './doc.model';

export interface SimpleUser {
  id: string;
}

export type Role = 'admin' | 'manager' | 'collector';

export interface User extends Doc{
  firstName?: string;
  lastName?: string;
  fullName?: string;
  pictureUrl?: string;
  email?: string;
  isHost?: boolean;
  lastProjectVisited?: string;
  projects?: {
    [projectId: string]: {
      isMember: true;
      isOwner: boolean;
      role: Role;
    };
  };
}
