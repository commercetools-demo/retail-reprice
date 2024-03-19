import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { TProductProjection } from '../../types/generated/ctp';
import { projectionBuilder, requestBuilder } from '../../utils/query';

export interface Result {
  total: number;
  offset: number;
  limit: number;
  hits: {
    id: string;
    productProjection: TProductProjection;
  }[];
}

export interface Query {
  storeId: string;
  storeKey?: string;
  country?: string;
  currency?: string;
  productSelections?: string[];
  distributionChannels?: string[];
  noAnyChannelPrice?: boolean;
}

function buildUrlWithParams(
  baseUrl: string,
  options: Record<string, string | string[]>
) {
  const queryParams = new URLSearchParams();
  if (!options) {
    return baseUrl;
  }

  for (const [key, value] of Object.entries(options)) {
    if (Array.isArray(value)) {
      value.forEach((item) => queryParams.append(key, item));
    } else {
      queryParams.append(key, value);
    }
  }

  return `${baseUrl}?${queryParams}`;
}

const getPrice = (
  requestQuery: Query,
  price: TProductProjection['masterVariant']['price']
) => {
  if (
    !requestQuery.distributionChannels?.length ||
    !requestQuery.noAnyChannelPrice
  ) {
    return price;
  }
  return requestQuery.distributionChannels.includes(price?.channel?.id || '')
    ? price
    : undefined;
};
export const UseProducts = () => {
  const dispatch = useAsyncDispatch<TSdkAction, Result>();
  const context = useApplicationContext((context) => context);

  const getProducts = async (
    requestQuery: Query,
    limit: number,
    page: number
  ): Promise<Result> => {
    const offset = (page - 1) * limit;

    const projection = projectionBuilder(requestQuery, context.dataLocale);
    const query = requestBuilder(requestQuery);
    const result = await dispatch(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/products/search`,
          {}
        ),
        payload: {
          query,
          projection,
          limit,
          offset,
        },
      })
    );
    return {
      ...result,
      hits: result.hits.map((hit) => ({
        ...hit,
        productProjection: {
          ...hit.productProjection,
          masterVariant: {
            ...hit.productProjection.masterVariant,
            price: getPrice(
              requestQuery,
              hit.productProjection.masterVariant.price
            ),
          },
        },
      })),
    };
  };

  return {
    getProducts,
  };
};
