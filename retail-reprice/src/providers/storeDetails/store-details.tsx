import React, { useContext, useEffect, useState } from 'react';
import { Query, Result, UseProducts } from '../../hooks/use-products';

interface StoreDetailsContextReturn {
  filters: Query;
  result?: Result;
  setFilters: (query: Query) => void;
  updateFilters: (query: Omit<Query, 'storeId'>) => void;
  setPagination: (payload: { limit: number; page: number }) => void;
}

const initialData = {
  filters: {} as Query,
  result: {} as Result,
  setFilters: () => {},
  updateFilters: () => null,
  setPagination: () => null,
};

const StoreDetailsContext =
  React.createContext<StoreDetailsContextReturn>(initialData);

const getCountryAndCurrencyInURLParams = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    ...(urlParams.get('country') && { country: urlParams.get('country') }),
    ...(urlParams.get('currency') && { currency: urlParams.get('currency') }),
  };
  return params as Record<string, string>;
};

const getCountryAndCurrencyFromLocalStorage = (): Record<string, string> => {
  const country = localStorage.getItem('country');
  const currency = localStorage.getItem('currency');
  return {
    ...(country && { country }),
    ...(currency && { currency }),
  };
};
const getCountryAndCurrency = () => {
  const urlParams = getCountryAndCurrencyInURLParams();
  const localStorageParams = getCountryAndCurrencyFromLocalStorage();

  const newLocal = {
    ...urlParams,
    ...localStorageParams,
  };
  return newLocal;
};
const saveCountryAndCurrencyInURLParams = (query: Partial<Query>) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (query.country) {
    urlParams.set('country', query.country);
  }
  if (query.currency) {
    urlParams.set('currency', query.currency);
  }
  window.history.replaceState({}, '', `?${urlParams.toString()}`);
};

const saveCountryAndCurrencyInLocalStorage = (query: Partial<Query>) => {
  if (query.country) {
    localStorage.setItem('country', query.country);
  }
  if (query.currency) {
    localStorage.setItem('currency', query.currency);
  }
};

const setCountryAndCurrency = (query: Query) => {
  saveCountryAndCurrencyInURLParams(query);
  saveCountryAndCurrencyInLocalStorage(query);
};

const StoreDetailsProvider = ({
  children,
  storeId,
}: React.PropsWithChildren<{ storeId: string }>) => {
  const [filters, setFilters] = useState<Query>({
    storeId,
    ...getCountryAndCurrency(),
  });
  const [result, setResult] = useState<Result>();
  const { getProducts: getProductsCall } = UseProducts();

  const [pagination, setPagination] = useState<{ limit: number; page: number }>(
    {
      limit: 20,
      page: 1,
    }
  );

  const updateFilters = (query: Omit<Query, 'storeId'>) => {
    const newQuery = {
      ...getCountryAndCurrency(),
      storeId,
      ...query,
    };
    setFilters(newQuery);

    setCountryAndCurrency(newQuery);
  };

  const getProducts = async (limit: number, page: number) => {
    const result = await getProductsCall(filters, limit, page);
    setResult(result);
  };

  useEffect(() => {
    getProducts(pagination.limit, pagination.page);
  }, [filters, pagination.limit, pagination.page]);

  return (
    <StoreDetailsContext.Provider
      value={{
        filters,
        result,
        setFilters,
        updateFilters,
        setPagination,
      }}
    >
      {children}
    </StoreDetailsContext.Provider>
  );
};

export default StoreDetailsProvider;

export const useStoreDetailsContext = () => useContext(StoreDetailsContext);
