import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import { Link as RouterLink, useParams, useRouteMatch } from 'react-router-dom';
import { useBusinessUnitDetailsFetcher } from '../../hooks/use-business-units-connector';
import TagsProvider from '../../providers/tags/tags';
import messages from './messages';
import TaggedStoresTables from '../stores/tagged-store-tables';
import CollapsableStoreTable from '../stores/collapsable-store-table';


const BusinessUnitDetails = () => {
  const intl = useIntl();
  const params = useParams<{ id: string }>();
  const match = useRouteMatch();

  const prevUrl = match.url.split('/').slice(0, -1).join('/');

  const { businessUnit } = useBusinessUnitDetailsFetcher(params.id);

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={prevUrl}
          label={intl.formatMessage(messages.backToBusinessUnitList)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2">
          {intl.formatMessage(messages.title, {
            businessUnitName: businessUnit?.name,
          })}
        </Text.Headline>
      </Spacings.Stack>
      <Spacings.Stack scale="xs">
        <TagsProvider>
          <TaggedStoresTables
            items={businessUnit?.stores}
            redirectUrl="stores"
          />
          <CollapsableStoreTable
            stores={businessUnit?.stores}
            redirectUrl="stores"
            isDefaultClosed 
            header={intl.formatMessage(messages.allStores)}
          />
        </TagsProvider>
      </Spacings.Stack>
    </Spacings.Stack>
  );
};
BusinessUnitDetails.displayName = 'BusinessUnitDetails';

export default BusinessUnitDetails;
