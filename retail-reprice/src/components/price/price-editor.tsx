import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoneyInput, {
  TMoneyValue,
  TValue,
} from '@commercetools-uikit/money-input';
import { UseProducts } from '../../hooks/use-products';
import { TProductProjection } from '../../types/generated/ctp';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

type Props = {
  product: TProductProjection;
  currency?: string;
  onPriceChange: (productId: string) => void;
};

const PriceEditor: React.FC<Props> = ({ product, currency, onPriceChange }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { updateProductPrice } = UseProducts();
  const { filters, result } = useStoreDetailsContext();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
  }));
  const MoneyValueToValue = (money?: TMoneyValue): TValue => {
    return MoneyInput.parseMoneyValue(
      money?.centAmount
        ? money
        : ({
            centAmount: 0,
            currencyCode: currency || 'USD',
          } as TMoneyValue),
      dataLocale!
    );
  };

  const initialPrice = useMemo(() => {
    return (
      (product.masterVariant.price?.value?.centAmount ?? 0) / 100
    ).toFixed(product.masterVariant.price?.value.fractionDigits ?? 2);
  }, [product]);

  const [money, setMoney] = useState(
    MoneyValueToValue(product.masterVariant.price?.value as TMoneyValue)
  );

  const handleInputKeyDown = async (e: Event) => {
    if ((e as KeyboardEvent).key !== 'Enter') {
      return;
    }

    e.preventDefault();
    const latestProduct = result?.results.find(
      (p) => p.productProjection.id === product.id
    );
    onPriceChange(product.id);
    if (money?.amount !== initialPrice) {
      await updateProductPrice(
        product.id,
        latestProduct?.productProjection.version!,
        {
          centAmount: Number(money?.amount || 0) * 100,
          currencyCode: filters.currency,
        },
        product.masterVariant.sku,
        filters.country,
        filters.distributionChannels?.[0],
        // @ts-ignore
        product.priceMode,
        product.masterVariant.price?.value,
        product.masterVariant.price?.id
      );
    }
  };

  const handleChange = (event: any) => {
    setMoney({ ...money, amount: event.target.value });
  };

  useEffect(() => {
    setMoney(
      MoneyValueToValue(product.masterVariant.price?.value as TMoneyValue)
    );
  }, [product.masterVariant.price, currency]);

  useEffect(() => {
    if (formRef.current) {
      const wrappedInput = formRef.current.querySelector(
        'input[data-price-editor]'
      );
      if (wrappedInput) {
        wrappedInput.addEventListener('keydown', handleInputKeyDown);
      }
    }
    return () => {
      if (formRef.current) {
        const wrappedInput = formRef.current.querySelector(
          'input[data-price-editor]'
        );
        if (wrappedInput) {
          wrappedInput.removeEventListener('keydown', handleInputKeyDown);
        }
      }
    };
  }, [money, currency]);

  return (
    <form ref={formRef}>
      {money && currency && (
        <MoneyInput
          isDisabled={!currency}
          horizontalConstraint={5}
          value={money}
          currencies={[currency]}
          data-price-editor={product.id}
          onChange={handleChange}
        />
      )}
    </form>
  );
};

export default PriceEditor;
