import { Result } from '../../hooks/use-products';
import DataTable from '@commercetools-uikit/data-table';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import { useState } from 'react';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import CellRenderer from './cell-renderer';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';

export const initialVisibleColumns = [
  { key: 'name', label: 'Product name' },

  { key: 'key', label: 'Product key', isSortable: true },
  { key: 'price', label: 'Product Price' },
];
const initialHiddenColumns = [{ key: 'id', label: 'Product ID' }];

const initialColumnsState = [...initialVisibleColumns, ...initialHiddenColumns];

export const ProductList = () => {
  const { result } = useStoreDetailsContext();

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const [tableData, setTableData] = useState({
    columns: initialColumnsState,
    visibleColumnKeys: initialVisibleColumns.map(({ key }) => key),
  });
  const [isCondensed, setIsCondensed] = useState(true);
  const [isWrappingText, setIsWrappingText] = useState(false);

  const mappedColumns: Record<string, any> = tableData.columns.reduce(
    (columns, column) => ({
      ...columns,
      [column.key]: column,
    }),
    {}
  );
  const visibleColumns = tableData.visibleColumnKeys.map(
    (columnKey) => mappedColumns[columnKey]
  );

  const onSettingChange = (action: string, nextValue: boolean | string[]) => {
    const {
      COLUMNS_UPDATE,
      IS_TABLE_CONDENSED_UPDATE,
      IS_TABLE_WRAPPING_TEXT_UPDATE,
    } = UPDATE_ACTIONS;

    switch (action) {
      case IS_TABLE_CONDENSED_UPDATE: {
        setIsCondensed(nextValue as boolean);
        break;
      }
      case IS_TABLE_WRAPPING_TEXT_UPDATE: {
        setIsWrappingText(nextValue as boolean);
        break;
      }
      case COLUMNS_UPDATE: {
        if (Array.isArray(nextValue)) {
          Array.isArray(nextValue) &&
            setTableData({
              ...tableData,
              columns: tableData.columns.filter((column) =>
                nextValue.includes(column.key)
              ),
              visibleColumnKeys: nextValue,
            });
        }
        break;
      }
      default:
        break;
    }
  };

  const displaySettings = {
    disableDisplaySettings: false,
    isCondensed,
    isWrappingText,
  };

  const columnManager = {
    areHiddenColumnsSearchable: true,
    disableColumnManager: false,
    visibleColumnKeys: tableData.visibleColumnKeys,
    hideableColumns: tableData.columns,
  };
  return (
    <div style={{ width: '100%' }}>
      <DataTableManager
        columns={visibleColumns}
        onSettingsChange={onSettingChange}
        columnManager={columnManager}
        displaySettings={displaySettings}
      >
        <DataTable<NonNullable<Result['results']['0']>>
          isCondensed
          columns={initialVisibleColumns}
          rows={result?.results ?? []}
          itemRenderer={(item, column) => (
            <CellRenderer item={item} columnKey={column.key} />
          )}
          sortedBy={tableSorting.value.key}
          sortDirection={tableSorting.value.order}
          onSortChange={tableSorting.onChange}
        />
      </DataTableManager>
    </div>
  );
};
