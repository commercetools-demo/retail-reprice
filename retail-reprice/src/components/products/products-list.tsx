import { Result } from '../../hooks/use-products';
import DataTable from '@commercetools-uikit/data-table';
import { columns } from '../store-details/store-details';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useHistory, useRouteMatch } from 'react-router';

export const ProductList = ({ result }: { result?: Result }) => {
  const match = useRouteMatch();
  const { push } = useHistory();

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  return (
    <div style={{ width: '100%' }}>
      <DataTable<NonNullable<Result['hits']['0']>>
        isCondensed
        columns={columns}
        rows={result?.hits ?? []}
        itemRenderer={(item, column) => {
          switch (column.key) {
            case 'key':
              return item.productProjection.key;
            case 'id':
              return item.productProjection.id;
            case 'name':
              return item.productProjection.name?.[dataLocale || ''];
            default:
              return null;
          }
        }}
        sortedBy={tableSorting.value.key}
        sortDirection={tableSorting.value.order}
        onSortChange={tableSorting.onChange}
        onRowClick={(row) => push(`${match.url}/${row.id}`)}
      />
    </div>
  );
};
