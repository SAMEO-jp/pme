import React, { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorAlert from "./ui/ErrorAlert";
import ActionButton from "./ui/ActionButton";
import { Search, ChevronLeft, ChevronRight, Filter, ColumnsIcon, Settings, Plus } from "lucide-react";
import { useColumnSettings } from "./context/ColumnSettingsContext";

interface ColumnDefinition {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  visible?: boolean;
}

interface TableViewGridProps {
  data: any[];
  columns: ColumnDefinition[];
  isLoading: boolean;
  error: string | null;
  tableName?: string;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
  actionColumn?: boolean;
  headerTitle?: React.ReactNode;
  headerActions?: React.ReactNode;
}

interface BulkEditAction {
  field: string;
  value: any;
}

const TableViewGrid: React.FC<TableViewGridProps> = ({
  data,
  columns: initialColumns,
  isLoading,
  error,
  tableName,
  pageSize = 10,
  emptyMessage = "表示するデータがありません",
  onRowClick,
  actionColumn = true,
  headerTitle,
  headerActions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // 表示列設定関連
  const { showColumnSettings, setShowColumnSettings } = useColumnSettings();
  const [columns, setColumns] = useState<ColumnDefinition[]>(
    initialColumns.map(col => ({ ...col, visible: true }))
  );
  
  // 選択行の状態を内部で管理
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState<string[]>([]);
  const [bulkEditValues, setBulkEditValues] = useState<Record<string, any>>({});
  const [selectAll, setSelectAll] = useState(false);

  // 列幅自動調整モードの状態
  const [isAutoWidth, setIsAutoWidth] = useState(true);
  // 行高さ固定モードの状態
  const [isFixedRowHeight, setIsFixedRowHeight] = useState(true);

  // 初期カラム設定を反映
  useEffect(() => {
    setColumns(initialColumns.map(col => ({ ...col, visible: true })));
  }, [initialColumns]);

  if (isLoading) {
    return <LoadingSpinner className="h-40" />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // 検索フィルター
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ソート
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const compareResult = 
      typeof aValue === 'string' 
        ? aValue.localeCompare(bValue) 
        : aValue - bValue;
    
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  // ページング
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 表示列の切り替え
  const toggleColumnVisibility = (columnKey: string) => {
    setColumns(prev => 
      prev.map(col => col.key === columnKey ? { ...col, visible: !col.visible } : col)
    );
  };

  // 行の選択切り替え
  const toggleRowSelection = (row: any) => {
    if (typeof setSelectedRows === 'function') {
      // 関数型か配列型かを判定
      try {
        setSelectedRows((prev: any[]) => {
          const isSelected = prev.some((r: any) => JSON.stringify(r) === JSON.stringify(row));
          if (isSelected) {
            return prev.filter((r: any) => JSON.stringify(r) !== JSON.stringify(row));
          } else {
            return [...prev, row];
          }
        });
      } catch {
        // 関数型でなければ配列で直接渡す
        setSelectedRows([row]);
      }
    }
  };

  // すべての行の選択を切り替え
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (typeof setSelectedRows === 'function') {
      try {
        if (newSelectAll) {
          setSelectedRows((prev: any[]) => currentData as any[]);
        } else {
          setSelectedRows((prev: any[]) => [] as any[]);
        }
      } catch {
        if (newSelectAll) {
          setSelectedRows(currentData as any[]);
        } else {
          setSelectedRows([] as any[]);
        }
      }
    }
  };

  // 一括編集フィールドの追加/削除
  const toggleBulkEditField = (fieldKey: string) => {
    setBulkEditFields(prev => {
      if (prev.includes(fieldKey)) {
        // フィールドを削除
        const newFields = prev.filter(key => key !== fieldKey);
        
        // 値も削除
        const newValues = { ...bulkEditValues };
        delete newValues[fieldKey];
        setBulkEditValues(newValues);
        
        return newFields;
      } else {
        // フィールドを追加
        return [...prev, fieldKey];
      }
    });
  };

  // 一括編集の値を更新
  const updateBulkEditValue = (fieldKey: string, value: any) => {
    setBulkEditValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="py-2 px-3 flex justify-between items-center border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          {headerTitle}
        </div>
        <div className="flex items-center gap-2">
          <ActionButton 
            variant="secondary" 
            size="small"
            icon={<ColumnsIcon size={16} />}
            onClick={() => setShowColumnSettings(!showColumnSettings)}
          >
            列編集
          </ActionButton>
          {selectedRows.length > 0 && (
            <ActionButton
              variant="primary"
              size="small"
              icon={<Settings size={16} />}
              onClick={() => setShowBulkEdit(!showBulkEdit)}
            >
              編集
            </ActionButton>
          )}
          {headerActions}
          <div className="relative ml-2">
            <input
              type="text"
              placeholder="検索..."
              className="pl-8 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 列編集パネル */}
      {showColumnSettings && (
        <div className="p-3 border-b bg-gray-50">
          <h3 className="font-medium mb-1 text-sm">表示する列を選択</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {columns.map(column => (
              <label key={column.key} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="w-3 h-3"
                />
                <span>{column.header}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border text-xs font-medium ${isAutoWidth ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setIsAutoWidth((prev) => !prev)}
            >
              {isAutoWidth ? '自動幅ON' : '自動幅OFF'}
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded border text-xs font-medium ${isFixedRowHeight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setIsFixedRowHeight((prev) => !prev)}
            >
              {isFixedRowHeight ? '行高さ固定ON' : '高さ自動'}
            </button>
          </div>
        </div>
      )}

      {/* 一括編集パネル */}
      {showBulkEdit && (
        <div className="p-3 border-b bg-blue-50">
          <h3 className="font-medium mb-1 text-sm">一括編集 - {selectedRows.length}件選択中</h3>
          {/* 編集するフィールドの選択 */}
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">編集する列を選択:</p>
            <div className="flex flex-wrap gap-2">
              {columns.filter(col => col.visible).map(column => (
                <button
                  key={column.key}
                  onClick={() => toggleBulkEditField(column.key)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bulkEditFields.includes(column.key)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {column.header}
                </button>
              ))}
            </div>
          </div>
          {/* 選択されたフィールドの値入力フォーム */}
          {bulkEditFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {bulkEditFields.map(fieldKey => {
                const column = columns.find(col => col.key === fieldKey);
                if (!column) return null;
                return (
                  <div key={fieldKey} className="bg-white p-2 rounded border">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {column.header}の新しい値
                    </label>
                    <input
                      type="text"
                      className="w-full p-1 border rounded text-sm"
                      value={bulkEditValues[fieldKey] || ''}
                      onChange={(e) => updateBulkEditValue(fieldKey, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <ActionButton
              variant="primary"
              size="small"
              onClick={() => {
                // TODO: 実際の一括編集処理を実装
                alert('一括編集機能が実装されていません');
                setShowBulkEdit(false);
              }}
              disabled={bulkEditFields.length === 0}
            >
              一括適用
            </ActionButton>
            {selectedRows.length > 0 && (
              <ActionButton
                variant="danger"
                size="small"
                onClick={() => {
                  // 選択削除の処理を呼び出す
                  if (typeof setSelectedRows === 'function') {
                    setSelectedRows([]);
                  }
                  // 必要なら削除API呼び出し等
                  alert('選択レコード削除（実装例）');
                }}
              >
                選択削除
              </ActionButton>
            )}
            <ActionButton
              variant="secondary"
              size="small"
              onClick={() => {
                setShowBulkEdit(false);
                setBulkEditFields([]);
                setBulkEditValues({});
              }}
            >
              キャンセル
            </ActionButton>
          </div>
        </div>
      )}

      {/* テーブル本体を含むコンテナ - スクロールバーを表示 */}
      <div className="overflow-x-auto flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className={`w-full min-w-full divide-y divide-gray-200 ${isAutoWidth ? 'table-auto' : 'table-fixed'}`}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {/* 選択用チェックボックス列 */}
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8 sticky left-0 bg-gray-50 min-w-0">
                <input
                  type="checkbox"
                  className="w-3 h-3"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              {columns.filter(column => column.visible).map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer h-16 min-w-0 ${isAutoWidth ? '' : (column.width || 'w-32')}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    <div className="line-clamp-2">
                      {column.header}
                      {sortField === column.key && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
              {actionColumn && (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 min-w-0">
                  アクション
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => {
                const isSelected = selectedRows.some(r => JSON.stringify(r) === JSON.stringify(row));
                return (
                  <tr 
                    key={rowIndex} 
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {/* 選択用チェックボックス */}
                    <td className="px-2 py-2 whitespace-nowrap sticky left-0 bg-inherit min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(row)}
                      />
                    </td>
                    {columns.filter(column => column.visible).map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-2 min-w-0 ${isFixedRowHeight ? 'whitespace-nowrap truncate' : 'whitespace-normal'} ${isAutoWidth ? '' : (column.width || 'w-32')}`}
                      >
                        {column.render 
                          ? column.render(row[column.key], row)
                          : (
                            <div className="text-sm text-gray-900">
                              {row[column.key] !== null && row[column.key] !== undefined 
                                ? String(row[column.key]) 
                                : '-'}
                            </div>
                          )
                        }
                      </td>
                    ))}
                    {actionColumn && (
                      <td className="px-4 py-2 whitespace-nowrap text-sm min-w-0" onClick={(e) => e.stopPropagation()}>
                        {tableName && (
                          <>
                            <Link
                              href={`/z_datamanagement/table_view/${tableName}/${row.id || rowIndex}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              詳細
                            </Link>
                            <Link
                              href={`/z_datamanagement/table_edit/${tableName}/${row.id || rowIndex}`}
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              編集
                            </Link>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.filter(col => col.visible).length + (actionColumn ? 2 : 1)}
                  className="px-4 py-2 text-center text-sm text-gray-500 min-w-0"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-xs text-gray-700">
            {filteredData.length} 件中 {startIndex + 1} - {Math.min(endIndex, filteredData.length)} 件を表示
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`p-1 rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={`p-1 rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableViewGrid; 