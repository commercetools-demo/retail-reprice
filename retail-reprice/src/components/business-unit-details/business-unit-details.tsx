import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useBusinessUnitDetailsFetcher } from '../../hooks/use-business-units-connector';
import TagsProvider from '../../providers/tags/tags';
import StoresTable from '../stores/store-table';
import messages from './messages';

type TBusinessUnitDetailsProps = {
  linkToWelcome: string;
};

const BusinessUnitDetails = (props: TBusinessUnitDetailsProps) => {
  const intl = useIntl();
  const params = useParams<{ id: string }>();

  const { businessUnit } = useBusinessUnitDetailsFetcher(params.id);

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
          <StoresTable items={businessUnit?.stores} redirectUrl="stores" />
        </TagsProvider>
      </Spacings.Stack>
    </Spacings.Stack>
  );
};
BusinessUnitDetails.displayName = 'BusinessUnitDetails';

export default BusinessUnitDetails;
