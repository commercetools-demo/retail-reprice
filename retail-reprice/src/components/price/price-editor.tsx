import React, { useEffect, useState } from 'react';
import NumberInput from '@commercetools-uikit/number-input';
import { UseProducts } from '../../hooks/use-products';
import { TProductProjection } from '../../types/generated/ctp';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';

type Props = {
  product: TProductProjection;
  currency?: string;
  onPriceChange: (centAmount: number) => void;
};

const PriceEditor: React.FC<Props> = ({ product, currency, onPriceChange }) => {
  const { updateProductPrice } = UseProducts();
  const { filters, result, updateProductVersion } = useStoreDetailsContext();
  const [value, setValue] = useState<number>(
    (product.masterVariant.price?.value?.centAmount ?? 0) / 100
  );

  const handleStorePrice = async (e: React.FormEvent<HTMLFormElement>) => {
    const latestProduct = result?.hits.find(
      (p) => p.productProjection.id === product.id
    );
    e.preventDefault();
    if (value) {
      const result = await updateProductPrice(
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

      updateProductVersion(product.id, result.version);
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
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
    </form>
  );
};

export default PriceEditor;
