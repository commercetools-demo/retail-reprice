import { Query } from '../hooks/use-products';

export const requestBuilder = (query: Query) => {
  const queryArray = [
    {
      exact: {
        field: 'stores',
        value: query.storeId,
      },
    },
  ];
  if (query.productSelections?.length) {
    queryArray.push({
      // @ts-ignore
      or: query.productSelections.map((id) => ({
        exact: {
          field: 'productSelections',
          value: id,
        },
      })),
    });
  }
  if (queryArray.length > 1) {
    return {
      and: queryArray,
    };
  }
  return queryArray[0];
};

export const projectionBuilder = (query: Query, locale?: string) => {
  const projection: Record<string, any> = {
    localeProjection: [locale],
  };
  if (query.distributionChannels?.length) {
    projection.storeProjection = query.storeKey;
  }
  if (query.distributionChannels?.length && query.currency) {
    projection.priceChannel = query.distributionChannels[0];
  }
  if (query.country && query.currency) {
    projection.priceCountry = query.country;
  }
  if (query.currency) {
    projection.priceCurrency = query.currency;
  }
  return projection;
};
