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
  if (query.productSelections) {
    queryArray.push(
      ...query.productSelections.map((id) => ({
        exact: {
          field: 'productSelections',
          value: id,
        },
      }))
    );
  }
  if (queryArray.length > 1) {
    return {
      and: queryArray,
    };
  }
  return queryArray[0];
};
