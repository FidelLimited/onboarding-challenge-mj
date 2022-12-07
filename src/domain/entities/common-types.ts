import { Identity } from '@fidel.uk/types';

export interface CardInfo {
  mapId: string;
  expMonth: number;
  expYear: number;
  number: string;
  countryCode: string;
}

export enum VerificationMethodTypesEnum {
  email = 'email',
  phone = 'phone',
}

export interface VerificationMethod {
  methodRef: number;
  type?: VerificationMethodTypesEnum;
  value: string;
}

export type IdentityWithAccountName = Identity.Identity & {
  name: string;
};
