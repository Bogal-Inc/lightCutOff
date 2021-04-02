import { Doc, defaultDoc } from './doc.model';


export interface Device extends Doc{
  messagingToken: string;
}

export const defaultDevice = {
  ...defaultDoc,
  messagingToken: null,
} as Device;
