import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import DataTable from '@commercetools-uikit/data-table';
import { TDataTableSortingState } from '@commercetools-uikit/hooks';
import Spacings from '@commercetools-uikit/spacings';
import { Tag, TagList } from '@commercetools-uikit/tag';
import { useHistory, useRouteMatch } from 'react-router';
import { useTags } from '../../hooks/use-custom-object-connector';
import { useTagsContext } from '../../providers/tags/tags';
import { TStore } from '../../types/generated/ctp';
import NewTag from '../tags/new-tag';
import styles from './store-table.module.css';
type Props = {
  items?: TStore[];
  tableSorting?: TDataTableSortingState;
  redirectUrl?: string;
};
const columns = [
  { key: 'name', label: 'Store name' },
  { key: 'key', label: 'Store key', isSortable: true },
  { key: 'tags', label: 'Tags' },
];

const StoresTable = (props: Props) => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { push } = useHistory();
  const match = useRouteMatch();

  const { customObject, addTag, removeTag, loading } = useTagsContext();

  const { getTagsForStore } = useTags();

  const renderTags = (id: string) => {
    const tags = getTagsForStore(id, customObject);
    return (
      <Spacings.Inline justifyContent="flex-start">
        <TagList className={styles.tagList}>
          {tags &&
            tags.map((tag, index) => (
              <Tag key={index} onRemove={() => removeTag(tag, id)}>
                {tag}
              </Tag>
            ))}
        </TagList>
        <NewTag onAdd={(key) => addTag(key, id)} />
      </Spacings.Inline>
    );
  };

  return (
    <DataTable<TStore>
      isCondensed
      columns={columns}
      rows={props.items || []}
      itemRenderer={(item, column) => {
        switch (column.key) {
          case 'key':
            return item.key;
          case 'name':
            return formatLocalizedString(
              {
                name: transformLocalizedFieldToLocalizedString(
                  item.nameAllLocales ?? []
                ),
              },
              {
                key: 'name',
                locale: dataLocale,
                fallbackOrder: projectLanguages,
                fallback: NO_VALUE_FALLBACK,
              }
            );
          case 'tags':
            return loading ? 'Loading...' : renderTags(item.id);
          default:
            return null;
        }
      }}
      sortedBy={props?.tableSorting ? props.tableSorting.value.key : undefined}
      sortDirection={
        props?.tableSorting ? props.tableSorting.value.order : undefined
      }
      onSortChange={
        props?.tableSorting ? props.tableSorting.onChange : undefined
      }
      onRowClick={(row, _, column) => {
        if (column !== 'tags')
          push(
            `${match.url}/${
              props.redirectUrl ? `${props.redirectUrl}/${row.id}` : row.id
            }`
          );
      }}
    />
  );
};

export default StoresTable;
