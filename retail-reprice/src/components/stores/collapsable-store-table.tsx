import React from 'react';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import StoreTable from '../stores/store-table';
import { TStore } from '../../types/generated/ctp';
import styles from './collapsable-store-table.module.css';
import TagSettings from '../tags/tag-settings';

type Props = {
  stores?: TStore[];
  header: string;
  redirectUrl?: string;
  showSettings?: boolean;
  tag?: string;
};

const CollapsableStoreTable: React.FC<Props> = ({
  header,
  stores,
  redirectUrl,
  showSettings,
  tag,
}) => {
  return (
    <CollapsiblePanel header={header} className={styles.body}>
      {/* {showSettings && !!tag && <TagSettings tag={tag} />} */}
      <StoreTable items={stores} redirectUrl={redirectUrl} />
    </CollapsiblePanel>
  );
};

export default CollapsableStoreTable;
