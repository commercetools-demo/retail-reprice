import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';

const Welcome = () => {

  const {url} = useRouteMatch();
  return (
    <Constraints.Horizontal max={16}>
      <Spacings.Stack scale="xl">

        <RouterLink to={`${url}/stores`}>Stores</RouterLink>
        <RouterLink to={`${url}/channels`}>Channels</RouterLink>
        <RouterLink to={`${url}/business-units`}>Business Units</RouterLink>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
