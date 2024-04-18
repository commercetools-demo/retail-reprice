import React, { useEffect, useMemo, useState } from 'react';
import NumberInput from '@commercetools-uikit/number-input';
import { UseProducts } from '../../hooks/use-products';
import { TProductProjection } from '../../types/generated/ctp';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';

type Props = {
  product: TProductProjection;
  currency?: string;
  onPriceChange: (productId: string) => void;
};

const PriceEditor: React.FC<Props> = ({ product, currency, onPriceChange }) => {
  const { updateProductPrice } = UseProducts();
  const { filters, result } = useStoreDetailsContext();

  const initialPrice = useMemo(() => {
    return (product.masterVariant.price?.value?.centAmount ?? 0) / 100;
  }, [product]);
  const steps = useMemo(() => {
    return Math.pow(
      10,
      (product.masterVariant.price?.value?.fractionDigits ?? 2) * -1
    );
  }, [product]);

  const [value, setValue] = useState<number>(initialPrice);

  const handleStorePrice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const latestProduct = result?.results.find(
      (p) => p.productProjection.id === product.id
    );
    onPriceChange(product.id);
    if (value !== initialPrice) {
      await updateProductPrice(
        product.id,
        latestProduct?.productProjection.version!,
        {
          centAmount: value * 100,
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

  useEffect(() => {
    setValue((product.masterVariant.price?.value?.centAmount ?? 0) / 100);
  }, [product.masterVariant.price]);

  return (
    <form onSubmit={handleStorePrice}>
      <NumberInput
        isDisabled={!currency}
        horizontalConstraint={5}
        value={value}
        step={steps}
        data-price-editor={product.id}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
    </form>
  );
};

export default PriceEditor;
