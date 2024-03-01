import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import type { Maybe, TRawCustomField, TStore } from '../../types/generated/ctp';
import { ApolloError } from '@apollo/client';

export type TBusinessUnit = {
  id: string;
  name: string;
  key?: string;
  contactEmail?: string;
  custom: {
    customFieldsRaw?: Maybe<Array<TRawCustomField>>;
  };
};
export type TBusinessUnitDetail = {
  id: string;
  name: string;
  key?: string;
  custom: {
    customFieldsRaw?: Maybe<Array<TRawCustomField>>;
  };
  stores?: TStore[];
};

type TBusinessUnitsQueryResult = {
  results: TBusinessUnit[];
  total: number;
  offset: number;
  count: number;
};

export type TFetchBusinessUnitsQuery = {
  businessUnits: TBusinessUnitsQueryResult;
};

export type TFetchBusinessUnitDetailsQuery = {
  businessUnit: TBusinessUnit;
};

export type TFetchBusinessUnitDetailsQueryVariables = {
  businessUnitId: string;
};

export type TFetchBusinessUnitsQueryVariables = {
  limit: number;
  offset: number;
  sort: string[];
};

export type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};
export type TUseBusinessUnitsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  businessUnitsPaginatedResult?: TBusinessUnitsQueryResult;
  error?: ApolloError;
  loading: boolean;
};
