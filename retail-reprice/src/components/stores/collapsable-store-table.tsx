import React from 'react';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import StoreTable from '../stores/store-table';
import { TStore } from '../../types/generated/ctp';
import styles from './collapsable-store-table.module.css';

type Props = {
  stores?: TStore[];
  header: string;
  redirectUrl?: string;
};

const CollapsableStoreTable: React.FC<Props> = ({
  header,
  stores,
  redirectUrl,
}) => {
  return (
    <CollapsiblePanel header={header} className={styles.body}>
      <StoreTable items={stores} redirectUrl={redirectUrl} />
    </CollapsiblePanel>
  );
};

export default CollapsableStoreTable;
