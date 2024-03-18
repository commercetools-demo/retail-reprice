import React, { useEffect, useState } from 'react';
import { Query, Result } from '../../hooks/use-products';
import Spacings from '@commercetools-uikit/spacings';
import { useStoreDetailsFetcher } from '../../hooks/use-stores-connector';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import ToggleInput from '@commercetools-uikit/toggle-input';
import FieldLabel from '@commercetools-uikit/field-label';
import SpacingsInset from '@commercetools-uikit/spacings-inset';
import Text from '@commercetools-uikit/text';

import messages from './messages';
import { useIntl } from 'react-intl';
type Props = {
  result?: Result;
  storeId: string;
  onUpdateFilters: (query: Omit<Query, 'storeId'>) => void;
};

const ProductFilters: React.FC<Props> = ({ onUpdateFilters, storeId }) => {
  const { loading, store } = useStoreDetailsFetcher(storeId);
  console.log(store);
  
  const [data, setData] = useState<Omit<Query, 'storeId'>>({});
  const { formatMessage } = useIntl();
  const [isProductSelectionsActive, setIsProductSelectionsActive] =
    useState(false);
  useEffect(() => {
    
    if (store?.productSelections.length) {
       
      setData({
        ...data,
        productSelections: isProductSelectionsActive ? store.productSelections.map(
          (selection) => selection.productSelection?.id
        ).filter(Boolean) as string[] : [],
      });
    }
  }, [isProductSelectionsActive, store]);

  useEffect(() => {
    onUpdateFilters(data);
  }, [data]);

  if (loading) return <LoadingSpinner />;
  return (
    <SpacingsInset scale="l">
      <Spacings.Stack scale="xs" alignItems="flex-start">
        <Text.Headline as="h2">{formatMessage(messages.title)}</Text.Headline>
        <Spacings.Inline>
          <FieldLabel title={formatMessage(messages.productSelection)} />
          <ToggleInput
            size="small"
            isChecked={isProductSelectionsActive}
            isDisabled={store?.productSelections.length === 0}
            onChange={() =>
              setIsProductSelectionsActive(!isProductSelectionsActive)
            }
          />
        </Spacings.Inline>
      </Spacings.Stack>
    </SpacingsInset>
  );
};

export default ProductFilters;
