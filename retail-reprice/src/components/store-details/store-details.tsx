import { useIntl } from 'react-intl';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { BackIcon, FilterIcon } from '@commercetools-uikit/icons';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { Query, Result, UseProducts } from '../../hooks/use-products';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '@commercetools-uikit/pagination';
import { ProductList } from '../products/products-list';
import ProductFilters from '../products/product-filters';
import IconButton from '@commercetools-uikit/icon-button';
import SidebarLayout from '../sidebar-layout';

type TStoreDetailsProps = {
  linkToWelcome: string;
};

const StoreDetails = (props: TStoreDetailsProps) => {
  const intl = useIntl();
  const params = useParams<{ storeId: string }>();

  const { page, perPage } = usePaginationState({
    page: 1,
    perPage: 20,
  });

  const { getProducts } = UseProducts();

  const [result, setResult] = useState<Result>();
  const [areFiltersDisplayed, setAreFiltersDisplayed] = useState(false);
  const [filters, setFilters] = useState<Query>({
    storeId: params.storeId,
  });

  const updateFilters = (query: Omit<Query, 'storeId'>) => {
    console.log('query', query);

    setFilters({
      storeId: params.storeId,
      ...query,
    });
  };

  useEffect(() => {
    (async () => {
      const result = await getProducts(filters, perPage.value, page.value);
      setResult(result);
    })();
  }, [filters, page.value, perPage.value]);

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>
      <Spacings.Stack scale="xs">
        <IconButton
          label="Filters"
          icon={<FilterIcon />}
          onClick={() => setAreFiltersDisplayed(!areFiltersDisplayed)}
        />
        <Spacings.Inline alignItems="stretch">
          <ProductList result={result} />
          <SidebarLayout
            isOpen={areFiltersDisplayed}
            hideHeader
            onClose={() => setAreFiltersDisplayed(false)}
          >
            <ProductFilters
              result={result}
              onUpdateFilters={updateFilters}
              storeId={params.storeId}
            />
          </SidebarLayout>
        </Spacings.Inline>
        <Pagination
          page={page.value}
          onPageChange={page.onChange}
          perPage={perPage.value}
          onPerPageChange={perPage.onChange}
          totalItems={result?.total ?? 0}
        />
      </Spacings.Stack>
    </Spacings.Stack>
  );
};
StoreDetails.displayName = 'BusinessUnitDetails';

export default StoreDetails;
