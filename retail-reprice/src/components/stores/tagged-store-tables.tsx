import React, { useMemo } from 'react';
import { TStore } from '../../types/generated/ctp';
import { TDataTableSortingState } from '@commercetools-uikit/hooks';
import { useTagsContext } from '../../providers/tags/tags';
import { useTags } from '../../hooks/use-custom-object-connector';
import CollapsableStoreTable from './collapsable-store-table';

type Props = {
  items?: TStore[];
  tableSorting?: TDataTableSortingState;
  redirectUrl?: string;
};
const TaggedStoresTables: React.FC<Props> = ({ items, redirectUrl }) => {
  const { tags } = useTagsContext();

  const { filterTagsByStores } = useTags();
  const currentTags = useMemo(
    () =>
      filterTagsByStores(
        items?.map((item) => item.id),
        tags
      ),
    [items, tags]
  );

  const getStoresbyIds = (Ids: string[]) => {
    if (!Ids || !Ids.length) {
      return [];
    }
    return items?.filter((item) => Ids.includes(item.id));
  };

  if (!currentTags || Object.keys(currentTags).length === 0) {
    return null;
  }
  return (
    <>
      {Object.keys(currentTags).map((tag, index) => (
        <CollapsableStoreTable
          stores={getStoresbyIds(tags[tag].stores)}
          key={index}
          header={tag}
          redirectUrl={redirectUrl}
        />
      ))}
    </>
  );
};

export default TaggedStoresTables;
