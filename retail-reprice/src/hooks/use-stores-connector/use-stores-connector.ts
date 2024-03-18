/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type { TStore } from '../../types/generated/ctp';
import FetchStoresQuery from './fetch-stores.ctp.graphql';
import FetchStoreDetailsQuery from './fetch-store-details.ctp.graphql';
import {
  TUseStoresFetcher,
  TFetchStoreDetailsQuery,
  TFetchStoreDetailsQueryVariables,
  TFetchStoresQuery,
  TFetchStoresQueryVariables,
} from './types';

export const useStoresFetcher: TUseStoresFetcher = ({
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery<
    TFetchStoresQuery,
    TFetchStoresQueryVariables
  >(FetchStoresQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    storesPaginatedResult: data?.stores,
    error,
    loading,
  };
};

type TUseStoreDetailsFetcher = (storeId: string) => {
  store?: TStore;
  error?: ApolloError;
  loading: boolean;
};

export const useStoreDetailsFetcher: TUseStoreDetailsFetcher = (storeId) => {
  const { data, error, loading } = useMcQuery<
    TFetchStoreDetailsQuery,
    TFetchStoreDetailsQueryVariables
  >(FetchStoreDetailsQuery, {
    variables: {
      storeId,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    store: data?.store,
    error,
    loading,
  };
};
