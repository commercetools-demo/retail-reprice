import { lazy } from 'react';

const Stores = lazy(
  () => import('./stores' /* webpackChunkName: "stores" */)
);

export default Stores;
