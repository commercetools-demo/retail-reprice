import { lazy } from 'react';

const BusinessUnitDetails = lazy(
  () =>
    import(
      './business-unit-details' /* webpackChunkName: "business-unit-details" */
    )
);

export default BusinessUnitDetails;
