import React, { useEffect, useMemo, useState } from 'react';
import { Query } from '../../hooks/use-products';
import Spacings from '@commercetools-uikit/spacings';
import { useStoreDetailsFetcher } from '../../hooks/use-stores-connector';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import ToggleInput from '@commercetools-uikit/toggle-input';
import FieldLabel from '@commercetools-uikit/field-label';
import SpacingsInset from '@commercetools-uikit/spacings-inset';
import Text from '@commercetools-uikit/text';
import SelectInput from '@commercetools-uikit/select-input';
import Constraints from '@commercetools-uikit/constraints';

import messages from './messages';
import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';
type Props = {
  storeId: string;
};

const ProductFilters: React.FC<Props> = ({ storeId }) => {
  const { updateFilters, filters: defaultFilters } = useStoreDetailsContext();
  const { project, dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    project: context.project,
  }));

  const defaultCountry = useMemo(() => {
    if (defaultFilters.country) return defaultFilters.country;
    const localeSplitted = dataLocale?.split('-') || [];
    return localeSplitted.length > 1 ? localeSplitted[1] : '';
  }, [dataLocale]);
  const { loading, store } = useStoreDetailsFetcher(storeId);

  const [data, setData] = useState<Omit<Query, 'storeId'>>({});
  const { formatMessage } = useIntl();
  const [filters, setFilters] = useState({
    productSelection: false,
    priceChannel: true,
    noAnyChannelPrice: false,
    country: defaultCountry,
    currency: defaultFilters.currency || '',
  });

  useEffect(() => {
    setData({
      ...data,
      productSelections:
        store?.productSelections.length && filters.productSelection
          ? (store.productSelections
              .map((selection) => selection.productSelection?.id)
              .filter(Boolean) as string[])
          : [],
      distributionChannels: filters.priceChannel
        ? store?.distributionChannels?.map((channel) => channel.id)
        : [],
      country: filters.country,
      currency: filters.currency,
      noAnyChannelPrice: filters.noAnyChannelPrice,
    });
  }, [filters, store]);

  useEffect(() => {
    updateFilters(data);
  }, [data]);

  useEffect(() => {
    if (store) {
      setData({
        ...data,
        storeKey: store.key,
      });
    }
  }, [store]);

  if (loading) return <LoadingSpinner />;
  return (
    <SpacingsInset scale="l">
      <Spacings.Stack scale="l">
        <Text.Headline as="h2">{formatMessage(messages.title)}</Text.Headline>
        <Spacings.Stack scale="s" alignItems="stretch">
          <Constraints.Horizontal max={16}>
            <Spacings.Inline alignItems="stretch">
              <FieldLabel title={formatMessage(messages.country)} />
              <SelectInput
                value={filters.country}
                options={project?.countries.map((country) => ({
                  label: country,
                  value: country,
                }))}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    country: value.target.value as string,
                  })
                }
              />
            </Spacings.Inline>
          </Constraints.Horizontal>
          <Constraints.Horizontal max={16}>
            <Spacings.Inline>
              <FieldLabel title={formatMessage(messages.currency)} />
              <SelectInput
                value={filters.currency}
                options={project?.currencies.map((currency) => ({
                  label: currency,
                  value: currency,
                }))}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    currency: value.target.value as string,
                  })
                }
              />
            </Spacings.Inline>
          </Constraints.Horizontal>
          <Constraints.Horizontal max={16}>
            <Spacings.Inline>
              <FieldLabel title={formatMessage(messages.productSelection)} />
              <ToggleInput
                size="small"
                isChecked={filters.productSelection}
                isDisabled={store?.productSelections.length === 0}
                onChange={() =>
                  setFilters({
                    ...filters,
                    productSelection: !filters.productSelection,
                  })
                }
              />
            </Spacings.Inline>
          </Constraints.Horizontal>
          <Constraints.Horizontal max={16}>
            <Spacings.Inline>
              <FieldLabel
                title={formatMessage(messages.priceChannel, {
                  distributionChannels: store?.distributionChannels
                    ?.map((channel) => channel.key)
                    .join(', '),
                })}
              />
              <ToggleInput
                size="small"
                isChecked={filters.priceChannel}
                isDisabled={store?.distributionChannels.length === 0}
                onChange={() =>
                  setFilters({
                    ...filters,
                    priceChannel: !filters.priceChannel,
                  })
                }
              />
            </Spacings.Inline>
          </Constraints.Horizontal>
          <Constraints.Horizontal max={16}>
            <Spacings.Inline>
              <FieldLabel title={formatMessage(messages.noAny)} />
              <ToggleInput
                size="small"
                isChecked={filters.noAnyChannelPrice}
                isDisabled={store?.distributionChannels.length === 0}
                onChange={() =>
                  setFilters({
                    ...filters,
                    noAnyChannelPrice: !filters.noAnyChannelPrice,
                  })
                }
              />
            </Spacings.Inline>
          </Constraints.Horizontal>
        </Spacings.Stack>
      </Spacings.Stack>
    </SpacingsInset>
  );
};

export default ProductFilters;
