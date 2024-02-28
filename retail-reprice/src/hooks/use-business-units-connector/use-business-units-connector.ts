/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchBusinessUnitsQuery from './fetch-business-units.ctp.graphql';
import FetchBusinessUnitDetailsQuery from './fetch-business-unit-details.ctp.graphql';
import {
  TUseBusinessUnitsFetcher,
  TFetchBusinessUnitDetailsQuery,
  TFetchBusinessUnitDetailsQueryVariables,
  TFetchBusinessUnitsQuery,
  TFetchBusinessUnitsQueryVariables,
  TBusinessUnit,
} from './types';

export const useBusinessUnitsFetcher: TUseBusinessUnitsFetcher = ({
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery<
    TFetchBusinessUnitsQuery,
    TFetchBusinessUnitsQueryVariables
  >(FetchBusinessUnitsQuery, {
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
    businessUnitsPaginatedResult: data?.businessUnits,
    error,
    loading,
  };
};

type TUseBusinessUnitDetailsFetcher = (businessUnitId: string) => {
  businessUnit?: TBusinessUnit;
  error?: ApolloError;
  loading: boolean;
};

export const useBusinessUnitDetailsFetcher: TUseBusinessUnitDetailsFetcher = (businessUnitId) => {
  const { data, error, loading } = useMcQuery<
    TFetchBusinessUnitDetailsQuery,
    TFetchBusinessUnitDetailsQueryVariables
  >(FetchBusinessUnitDetailsQuery, {
    variables: {
      businessUnitId,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    businessUnit: data?.businessUnit,
    error,
    loading,
  };
};
