import { Result } from '../../hooks/use-products';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { useEffect, useState } from 'react';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import CellRenderer from './cell-renderer';
import { useStoreDetailsContext } from '../../providers/storeDetails/store-details';
import { Pagination } from '@commercetools-uikit/pagination';

export const initialVisibleColumns = [
  { key: 'name', label: 'Product name' },
  { key: 'priceMode', label: 'Price Mode' },
  { key: 'price', label: 'Product Price' },
];
const initialHiddenColumns = [{ key: 'id', label: 'Product ID' }];

const initialColumnsState = [...initialVisibleColumns, ...initialHiddenColumns];

export const ProductList = () => {
  const { result, setPagination } = useStoreDetailsContext();

  const { page, perPage } = usePaginationState();

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

  const handlePriceChange = (productId: string) => {
    const allPriceEditors = document.querySelectorAll('[data-price-editor]');
    for (let index = 0; index < allPriceEditors.length; index++) {
      const element = allPriceEditors[index];
      if (
        element.getAttribute('data-price-editor') === productId &&
        index !== allPriceEditors.length - 1
      ) {
        const nextElement = allPriceEditors[index + 1] as HTMLInputElement;
        nextElement.select();
        nextElement.focus();
        break;
      }
    }
  };

  useEffect(() => {
    setPagination({ page: page.value, limit: perPage.value });
  }, [page.value, perPage.value]);
  return (
    <div style={{ width: '100%' }}>
      <DataTableManager
        columns={visibleColumns}
        onSettingsChange={onSettingChange}
        columnManager={columnManager}
        displaySettings={displaySettings}
      >
        <>
          {' '}
          <DataTable<NonNullable<Result['results']['0']>>
            isCondensed
            columns={initialVisibleColumns}
            rows={result?.results ?? []}
            itemRenderer={(item, column) => (
              <CellRenderer
                item={item}
                columnKey={column.key}
                handlePriceChange={handlePriceChange}
              />
            )}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={result?.total ?? 0}
          />
        </>
      </DataTableManager>
    </div>
  );
};
