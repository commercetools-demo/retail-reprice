import React from 'react';
import PriceEditor from '../price/price-editor';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';

type Props = {
  item: any;
  columnKey: string;
};

const CellRenderer: React.FC<Props> = ({ columnKey, item }) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
  }));
  const { filters } = useStoreDetailsContext();
  const handlePriceChange = (centAmount: number, item: any) => {};
  switch (columnKey) {
    case 'key':
      return item.productProjection.key;
    case 'id':
      return item.productProjection.id;
    case 'name':
      return item.productProjection.name?.[dataLocale || ''];
    case 'price':
      return (
        <PriceEditor
          product={item.productProjection}
          currency={filters.currency}
          onPriceChange={(centAmount) => handlePriceChange(centAmount, item)}
        />
      );
    default:
      return null;
  }
};

export default CellRenderer;
