import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useParams,
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
import {
  useBusinessUnitDetailsFetcher,
  useBusinessUnitsFetcher,
} from '../../hooks/use-business-units-connector';
import { TBusinessUnit } from '../../hooks/use-business-units-connector/types';
import { FormModalPage } from '@commercetools-frontend/application-components';
import StoresTable from '../stores/store-table';
import TagsProvider from '../../providers/tags/tags';

const columns = [
  { key: 'name', label: 'Business unit name' },
  { key: 'key', label: 'Business key', isSortable: true },
  { key: 'roles', label: 'Roles' },
];

type TBusinessUnitDetailsProps = {
  linkToWelcome: string;
};

const BusinessUnitDetails = (props: TBusinessUnitDetailsProps) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const params = useParams<{ id: string }>();

  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { businessUnit, error, loading } = useBusinessUnitDetailsFetcher(
    params.id
  );

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
        <TagsProvider>
          <StoresTable items={businessUnit?.stores} />
        </TagsProvider>
      </Spacings.Stack>
    </Spacings.Stack>
  );
};
BusinessUnitDetails.displayName = 'BusinessUnitDetails';

export default BusinessUnitDetails;
