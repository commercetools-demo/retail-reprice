import React, { useContext, useEffect, useState } from 'react';
import { Query, Result, UseProducts } from '../../hooks/use-products';
import { usePaginationState } from '@commercetools-uikit/hooks';

interface StoreDetailsContextReturn {
  filters: Query;
  result?: Result;
  setFilters: (query: Query) => void;
  updateFilters: (query: Omit<Query, 'storeId'>) => void;
  updateProductVersion: (productId: string, version: number) => void;
}

const initialData = {
  filters: {} as Query,
  result: {} as Result,
  setFilters: () => {},
  updateFilters: () => null,
  updateProductVersion: () => null,
};

const StoreDetailsContext =
  React.createContext<StoreDetailsContextReturn>(initialData);

const StoreDetailsProvider = ({
  children,
  storeId,
}: React.PropsWithChildren<{ storeId: string }>) => {
  const [filters, setFilters] = useState<Query>({
    storeId,
  });
  const [result, setResult] = useState<Result>();
  const { getProducts: getProductsCall } = UseProducts();
  const { page, perPage } = usePaginationState();

  const updateFilters = (query: Omit<Query, 'storeId'>) => {
    setFilters({
      storeId,
      ...query,
    });
  };

  const updateProductVersion = (productId: string, version: number) => {
    if (result) {
      const newResult = {
        ...result,
        hits: result.hits.map((pp) => {
          if (pp.productProjection.id === productId) {
            return {
              ...pp,
              productProjection: {
                ...pp.productProjection,
                version,
              },
            };
          }
          return pp;
        }),
      };
      setResult(newResult);
    }
  };

  const getProducts = async () => {
    const result = await getProductsCall(filters, perPage.value, page.value);
    setResult(result);
  };

  useEffect(() => {
    getProducts();
  }, [filters, page.value, perPage.value]);

  return (
    <StoreDetailsContext.Provider
      value={{
        filters,
        result,
        setFilters,
        updateFilters,
        updateProductVersion,
      }}
    >
      {children}
    </StoreDetailsContext.Provider>
  );
};

export default StoreDetailsProvider;

export const useStoreDetailsContext = () => useContext(StoreDetailsContext);
