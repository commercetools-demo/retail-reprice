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
  isDefaultClosed?: boolean;
};

const CollapsableStoreTable: React.FC<Props> = ({
  header,
  stores,
  redirectUrl,
  showSettings,
  isDefaultClosed,
  tag,
}) => {
  return (
    <CollapsiblePanel header={header} className={styles.body} isDefaultClosed={isDefaultClosed} >
      {/* {showSettings && !!tag && <TagSettings tag={tag} />} */}
      <StoreTable items={stores} redirectUrl={redirectUrl} />
    </CollapsiblePanel>
  );
};

export default CollapsableStoreTable;
