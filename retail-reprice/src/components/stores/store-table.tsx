import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import DataTable from '@commercetools-uikit/data-table';
import { TDataTableSortingState } from '@commercetools-uikit/hooks';
import { useHistory, useRouteMatch } from 'react-router';
import { TStore } from '../../types/generated/ctp';
type Props = {
  items?: TStore[];
  tableSorting?: TDataTableSortingState;
};
const columns = [
  { key: 'name', label: 'Store name' },
  { key: 'key', label: 'Store key', isSortable: true },
  { key: 'roles', label: 'Roles' },
];
const StoresTable = (props: Props) => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { push } = useHistory();
  const match = useRouteMatch();

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
      onRowClick={(row) => push(`${match.url}/${row.id}`)}
    />
  );
};

export default StoresTable;
