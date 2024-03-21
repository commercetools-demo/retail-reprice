import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { TProductProjection } from '../../types/generated/ctp';
import { projectionBuilder, requestBuilder } from '../../utils/query';
import { Money, Product, StandalonePrice } from '../../types';

export interface Result {
  total: number;
  offset: number;
  limit: number;
  results: {
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

function mapSearchResultToProductPrices(
  result: Result,
  requestQuery: Query
): Result | PromiseLike<Result> {
  return {
    ...result,
    results: result.results.map((hit) => ({
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
}

export const UseProducts = () => {
  const dispatchProductSearch = useAsyncDispatch<TSdkAction, Result>();
  const dispatchProductUpdate = useAsyncDispatch<TSdkAction, Product>();
  const dispatchStandalonePriceUpdate = useAsyncDispatch<
    TSdkAction,
    StandalonePrice
  >();
  const context = useApplicationContext((context) => context);

  const getProducts = async (
    requestQuery: Query,
    limit: number,
    page: number
  ): Promise<Result> => {
    const offset = (page - 1) * limit;

    const projection = projectionBuilder(requestQuery, context.dataLocale);
    const query = requestBuilder(requestQuery);
    const result = await dispatchProductSearch(
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
    return mapSearchResultToProductPrices(result, requestQuery);
  };

  const updateProductStandalonePrice = async (
    newPrice: Money,
    oldPriceId?: string | null
  ): Promise<StandalonePrice> => {
    const standalonePrice = await dispatchStandalonePriceUpdate(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/standalone-prices/${oldPriceId}`,
          {}
        ),
      })
    );
    return dispatchStandalonePriceUpdate(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/standalone-prices/${oldPriceId}`,
          {}
        ),
        payload: {
          version: standalonePrice.version,
          actions: [
            {
              action: 'changeValue',
              staged: false,
              value: newPrice,
            },
          ],
        },
      })
    );
  };

  const updateProductPrice = async (
    productId: string,
    version: number,
    newPrice: Money,
    sku?: string | null,
    country?: string,
    channel?: string,
    priceMode?: string,
    oldPrice?: Money,
    oldPriceId?: string | null
  ): Promise<Product> => {
    if (priceMode === 'Standalone') {
      return updateProductStandalonePrice(newPrice, oldPriceId);
    }
    let action = {
      action: 'addPrice',
      sku,
      price: {
        value: {
          currencyCode: newPrice.currencyCode,
          centAmount: newPrice.centAmount,
        },
        country,
        channel: {
          id: channel,
          typeId: 'channel',
        },
      },
      staged: false,
    };

    if (oldPrice && oldPriceId) {
      action = {
        action: 'changePrice',
        // @ts-ignore
        priceId: oldPriceId,
        price: {
          value: {
            currencyCode: newPrice.currencyCode,
            centAmount: newPrice.centAmount,
          },
          country,
          channel: {
            id: channel,
            typeId: 'channel',
          },
        },
        staged: false,
      };
    }
    const result = await dispatchProductUpdate(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/products/${productId}`,
          {}
        ),
        payload: {
          version,
          actions: [action],
        },
      })
    );
    return result;
  };

  return {
    getProducts,
    updateProductPrice,
  };
};
