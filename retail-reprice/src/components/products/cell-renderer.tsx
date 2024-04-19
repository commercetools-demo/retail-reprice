import React from 'react';
import PriceEditor from '../price/price-editor';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';

type Props = {
  item: any;
  columnKey: string;
  handlePriceChange: (productId: string) => void;
};

const CellRenderer: React.FC<Props> = ({
  columnKey,
  item,
  handlePriceChange,
}) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
  }));
  const { filters } = useStoreDetailsContext();
  switch (columnKey) {
    case 'id':
      return item.productProjection.id;
    case 'name':
      return item.productProjection.name?.[dataLocale || ''] || 'N/A';
    case 'price':
      return (
        <PriceEditor
          product={item.productProjection}
          currency={filters.currency}
          onPriceChange={handlePriceChange}
        />
      );
    default:
      return null;
  }
};

export default CellRenderer;
