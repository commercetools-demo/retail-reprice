import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import type { TStoreQueryResult, TStore } from '../../types/generated/ctp';
import { ApolloError } from '@apollo/client';

export type TFetchStoresQuery = {
  stores: TStoreQueryResult;
};

export type TFetchStoreDetailsQuery = {
  store: TStore;
};

export type TFetchStoreDetailsQueryVariables = {
  storeId: string;
};

export type TFetchStoresQueryVariables = {
  limit: number;
  offset: number;
  sort: string[];
};

export type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};
export type TUseStoresFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  storesPaginatedResult?: TStoreQueryResult;
  error?: ApolloError;
  loading: boolean;
};
