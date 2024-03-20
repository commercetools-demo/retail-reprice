import type { TChannelRole } from './types/generated/ctp';

export type TFormValues = {
  key: string;
  name: Record<string, string>;
  roles: TChannelRole[];
};

export type TSyncAction = { action: string; [x: string]: unknown };

export type TGraphqlUpdateAction = Record<string, Record<string, unknown>>;

export type TChangeNameActionPayload = {
  name: Record<string, string>;
};

export interface Money {
  fractionDigits?: number;
  centAmount?: number;
  currencyCode?: string; // The currency code compliant to ISO 4217.
}
export interface Product {
  version: number;
}
export interface StandalonePrice {
  version: number;
}
