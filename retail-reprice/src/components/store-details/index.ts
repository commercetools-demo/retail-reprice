import { lazy } from 'react';

const BusinessUnitDetails = lazy(
  () =>
    import(
      './store-details' /* webpackChunkName: "store-details" */
    )
);

export default BusinessUnitDetails;
