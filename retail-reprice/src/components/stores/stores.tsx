import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import messages from './messages';
import { useStoresFetcher } from '../../hooks/use-stores-connector';
import { getErrorMessage } from '../../helpers';
import { TFetchStoresQuery } from '../../hooks/use-stores-connector/types';

const columns = [
  { key: 'name', label: 'Store name' },
  { key: 'key', label: 'Store key', isSortable: true },
  { key: 'roles', label: 'Roles' },
];

type TStoresProps = {
  linkToWelcome: string;
};

const Stores = (props: TStoresProps) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { storesPaginatedResult, error, loading } = useStoresFetcher({
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

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

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {storesPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TFetchStoresQuery['stores']['results']>[0]>
            isCondensed
            columns={columns}
            rows={storesPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'key':
                  return item.key;
                case 'name':
                  return formatLocalizedString(
                    {
                      name: transformLocalizedFieldToLocalizedString(
                        item.nameAllLocales ?? []
                      ),
                    },
                    {
                      key: 'name',
                      locale: dataLocale,
                      fallbackOrder: projectLanguages,
                      fallback: NO_VALUE_FALLBACK,
                    }
                  );
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={storesPaginatedResult.total}
          />
          {/* <Switch>
            <SuspendedRoute path={`${match.url}/:id`}>
              <ChannelDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch> */}
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Stores.displayName = 'Stores';

export default Stores;
