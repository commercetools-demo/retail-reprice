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
import messages from './messages';
import { getErrorMessage } from '../../helpers';
import { useBusinessUnitsFetcher } from '../../hooks/use-business-units-connector';
import { TBusinessUnit } from '../../hooks/use-business-units-connector/types';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import BusinessUnitDetails from '../business-unit-details';

const columns = [
  { key: 'name', label: 'Business unit name' },
  { key: 'key', label: 'Business key', isSortable: true },
  { key: 'roles', label: 'Roles' },
];

type TBusinessUnitsProps = {
  linkToWelcome: string;
};

const BusinessUnits = (props: TBusinessUnitsProps) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { businessUnitsPaginatedResult, error, loading } =
    useBusinessUnitsFetcher({
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

      {businessUnitsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TBusinessUnit>>
            isCondensed
            columns={columns}
            rows={businessUnitsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'key':
                  return item.key;
                case 'name':
                  return item.name;
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
            totalItems={businessUnitsPaginatedResult.total}
          />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
BusinessUnits.displayName = 'BusinessUnits';

export default BusinessUnits;
