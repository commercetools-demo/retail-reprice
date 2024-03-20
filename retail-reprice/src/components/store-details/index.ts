import { lazy } from 'react';

const StoreDetails = lazy(
  () =>
    import(
      './store-details-wrapper' /* webpackChunkName: "store-details-wrapper" */
    )
);

export default StoreDetails;
