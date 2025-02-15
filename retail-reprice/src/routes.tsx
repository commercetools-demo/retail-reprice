import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Channels from './components/channels';
import Welcome from './components/welcome';
import Stores from './components/stores';
import BusinessUnits from './components/business-units';
import BusinessUnitDetails from './components/business-unit-details';
import StoreDetails from './components/store-details';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();

  const { googleMapApiKey } = useApplicationContext<{
    googleMapApiKey: string;
  }>((context: any) => context.environment);

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/custom-applications/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <APIProvider apiKey={googleMapApiKey}>
      <Spacings.Inset scale="l">
        <Switch>
          <Route path={`${match.path}/channels`}>
            <Channels linkToWelcome={match.url} />
          </Route>
          <Route path={`${match.path}/stores/:storeId`}>
            <StoreDetails linkToWelcome={match.url} />
          </Route>
          <Route path={`${match.path}/stores`}>
            <Stores linkToWelcome={match.url} />
          </Route>
          <Route path={`${match.path}/business-units/:id/stores/:storeId`}>
            <StoreDetails linkToWelcome={match.url} />
          </Route>
          <Route path={`${match.path}/business-units/:id`}>
            <BusinessUnitDetails />
          </Route>
          <Route path={`${match.path}/business-units`}>
            <BusinessUnits linkToWelcome={match.url} />
          </Route>

          <Route>
            <Welcome />
          </Route>
        </Switch>
      </Spacings.Inset>
    </APIProvider>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
