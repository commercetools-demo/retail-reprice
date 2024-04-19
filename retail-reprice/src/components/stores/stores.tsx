import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';
import { getErrorMessage } from '../../helpers';
import { useStoresFetcher } from '../../hooks/use-stores-connector';
import messages from './messages';
import StoresTable from './store-table';
import TagsProvider from '../../providers/tags/tags';
import TaggedStoresTables from './tagged-store-tables';
import CollapsableStoreTable from './collapsable-store-table';

type TStoresProps = {
  linkToWelcome: string;
};

const Stores = (props: TStoresProps) => {
  const intl = useIntl();

  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

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
          <TagsProvider>
            <TaggedStoresTables
              items={storesPaginatedResult.results}
              redirectUrl=""
            />
            <CollapsableStoreTable
              stores={storesPaginatedResult.results}
              redirectUrl=""
              isDefaultClosed
              header={intl.formatMessage(messages.allStores)}
            />

            {/* <Switch>
            <SuspendedRoute path={`${match.url}/:id`}>
              <ChannelDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch> */}
          </TagsProvider>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Stores.displayName = 'Stores';

export default Stores;
