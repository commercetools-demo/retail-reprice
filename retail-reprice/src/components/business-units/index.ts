import { lazy } from 'react';

const BusinessUnits = lazy(
  () => import('./business-units' /* webpackChunkName: "business-units" */)
);

export default BusinessUnits;
