"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import TableViewGrid from "../../../components/TableViewGrid"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"
import ErrorAlert from "../../../components/ui/ErrorAlert"
import ActionButton from "../../../components/ui/ActionButton"
import TableViewWrapper from "../../../components/layout/TableViewWrapper"
import CsvImportModal from "../../../components/ui/CsvImportModal"
import AddRecordModal from "../../../components/ui/AddRecordModal"
import { X, Download, FileUp, Plus, ColumnsIcon, Trash2 } from "lucide-react"

interface ColumnConfig {
  columnName: string;
  displayName: string;
  isKey: boolean;
  columnType: string;
}

interface ImportStats {
  inserted: number
  updated: number
  skipped: number
}

interface ImportOptions {
  noDuplicates: boolean
  createNewTable: boolean
}

// 利用可能なエンコーディングのリスト
const ENCODING_OPTIONS = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'Shift_JIS', label: 'Shift-JIS' },
  { value: 'EUC-JP', label: 'EUC-JP' },
  { value: 'ISO-8859-1', label: 'ISO-8859-1 (Latin-1)' }
]

export default function TableViewPage() {
  return (
    <TableViewWrapper>
      <TableViewPageContent />
    </TableViewWrapper>
  );
}

function TableViewPageContent() {
  const params = useParams()
  const tableName = params.table as string
  const router = useRouter()
  
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false)
  const [selectedEncoding, setSelectedEncoding] = useState('Shift_JIS')
  const [isEncodingModalOpen, setIsEncodingModalOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [showPrimaryKeyDialog, setShowPrimaryKeyDialog] = useState(false)
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState<string | null>(null)
  const deleteButtonRef = useRef<HTMLDivElement>(null)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false)
  
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // カラム情報の取得
      const columnsResponse = await fetch(`/api/z_datamanagement/column_config?table=${tableName}`)
      if (!columnsResponse.ok) {
        throw new Error('カラム情報の取得に失敗しました')
      }
      
      const columnsData = await columnsResponse.json()
      const tableInfo = columnsData.tables.find((t: any) => t.tableName === tableName)
      
      if (!tableInfo) {
        throw new Error('テーブル情報が見つかりませんでした')
      }
      
      setColumns(tableInfo.columns)
      
      // テーブルデータの取得（500件まで）
      const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=500`)
      if (!dataResponse.ok) {
        throw new Error('テーブルデータの取得に失敗しました')
      }
      
      const tableData = await dataResponse.json()
      setData(tableData.rows || [])
      setError(null)
    } catch (err) {
      console.error('データ取得エラー:', err)
      setError(`テーブル「${tableName}」のデータを取得できませんでした`)
      setData([])
      setColumns([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (tableName) {
      fetchData()
    }
  }, [tableName])
  
  // カラム定義をTableViewGridのフォーマットに変換
  const tableColumns = columns.map((column) => ({
    key: column.columnName,
    header: column.displayName || column.columnName,
    // カラムタイプに基づいて幅を設定
    width: column.columnType?.toLowerCase().includes('date') ? 'w-32' : 
           column.isKey ? 'w-24' : 
           column.columnName.toLowerCase().includes('id') ? 'w-24' : 
           undefined,
    render: (value: any) => {
      // データ型に応じた表示処理
      if (value === null || value === undefined) {
        return <span className="text-gray-400">null</span>
      }
      
      if (column.columnType?.toLowerCase().includes('date') && value) {
        try {
          const date = new Date(value)
          // 日付のフォーマットを短く
          return date.toLocaleDateString('ja-JP')
        } catch (e) {
          return value
        }
      }
      
      if (typeof value === 'boolean' || column.columnType?.toLowerCase() === 'boolean') {
        return value ? 'はい' : 'いいえ'
      }
      
      return value
    }
  }))
  
  const handleCsvDownload = async () => {
    try {
      const response = await fetch(`/api/z_datamanagement/table_data/csv?table=${tableName}&encoding=${selectedEncoding}`)
      if (!response.ok) {
        throw new Error('CSVのダウンロードに失敗しました')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tableName}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('CSVダウンロードエラー:', err)
      setError('CSVのダウンロードに失敗しました')
    }
  }

  const handleCsvImport = async (file: File, options: ImportOptions): Promise<ImportStats> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('options', JSON.stringify(options))

    const response = await fetch(`/api/z_datamanagement/table_data/csv?table=${tableName}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'CSVのインポートに失敗しました')
    }

    const result = await response.json()

    // データを再取得
    const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=500`)
    if (!dataResponse.ok) {
      throw new Error('テーブルデータの取得に失敗しました')
    }
    
    const tableData = await dataResponse.json()
    setData(tableData.rows || [])

    return result.stats
  }
  
  // 主キーを設定する関数
  const handleSetPrimaryKey = async () => {
    try {
      if (!selectedPrimaryKey) {
        setError('主キーとして設定するカラムを選択してください')
        return
      }

      // 主キーを追加
      const response = await fetch('/api/z_datamanagement/table_data/add_primary_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          columnName: selectedPrimaryKey,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '主キーの設定に失敗しました')
      }

      // d_culum_styleテーブルを更新
      const updateResponse = await fetch('/api/z_datamanagement/column_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          columnName: selectedPrimaryKey,
          isPrimaryKey: true,
        }),
      })

      if (!updateResponse.ok) {
        const data = await updateResponse.json()
        throw new Error(data.error || 'カラム設定の更新に失敗しました')
      }

      // データを再取得
      await fetchData()
      setShowPrimaryKeyDialog(false)
      setSelectedPrimaryKey('')
      setError('')
    } catch (error: any) {
      console.error('主キー設定エラー:', error)
      setError(error.message || '主キーの設定に失敗しました')
    }
  }

  const handleDeleteSelectedRecords = async () => {
    if (selectedRows.length === 0) return;
    
    // 主キーが設定されているか確認
    const hasPrimaryKey = columns.some(col => col.isKey);
    if (!hasPrimaryKey) {
      setShowPrimaryKeyDialog(true);
      return;
    }
    
    setDeleting(true);
    try {
      const pkColumns = columns.filter(col => col.isKey).map(col => col.columnName);
      const keys = selectedRows.map(row => {
        const obj: any = {};
        pkColumns.forEach(col => { obj[col] = row[col] });
        return obj;
      });

      const response = await fetch(`/api/z_datamanagement/table_data?table=${tableName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レコードの削除に失敗しました');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'レコードの削除に失敗しました');
      }

      // データを再取得
      await fetchData();
      setSelectedRows([]);
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      console.error('削除エラー:', err);
      setError(err.message || 'レコードの削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllRecords = async () => {
    setDeletingAll(true)
    try {
      const response = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&all=true`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || '全件削除に失敗しました')
      // データ再取得
      const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=500`)
      const tableData = await dataResponse.json()
      setData(tableData.rows || [])
      setSelectedRows([])
      setIsDeleteAllDialogOpen(false)
    } catch (err: any) {
      setError(err.message || '全件削除に失敗しました')
    } finally {
      setDeletingAll(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{tableName}</h1>
        <div className="flex gap-2">
          <ActionButton
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddRecordModalOpen(true)}
            tooltip="新規追加"
          />
          <ActionButton
            icon={<FileUp className="w-4 h-4" />}
            onClick={() => setIsCsvImportModalOpen(true)}
            tooltip="CSVインポート"
          />
          <ActionButton
            icon={<Download className="w-4 h-4" />}
            onClick={handleCsvDownload}
            tooltip="CSVダウンロード"
          />
          <select
            value={selectedEncoding}
            onChange={(e) => setSelectedEncoding(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {ENCODING_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ActionButton
            icon={<ColumnsIcon className="w-4 h-4" />}
            onClick={() => router.push(`/z_datamanagement/column_config/${tableName}/index`)}
            tooltip="カラム設定"
          />
          {selectedRows.length > 0 && (
            <ActionButton
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsDeleteDialogOpen(true)}
              tooltip="選択レコード削除"
              variant="danger"
            />
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} />}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableViewGrid
          data={data}
          columns={tableColumns}
          onSelectionChange={setSelectedRows}
          pageSize={20}
          onDeleteSelected={() => setIsDeleteDialogOpen(true)}
        />
      )}

      <CsvImportModal
        isOpen={isCsvImportModalOpen}
        onClose={() => setIsCsvImportModalOpen(false)}
        onImport={handleCsvImport}
        tableName={tableName}
      />

      <AddRecordModal
        isOpen={isAddRecordModalOpen}
        onClose={() => setIsAddRecordModalOpen(false)}
        columns={columns}
        tableName={tableName}
        onSuccess={fetchData}
      />

      {/* カラム設定モーダル */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">カラム設定</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowColumnSettings(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column.columnName} className="flex items-center gap-4 p-4 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{column.displayName || column.columnName}</div>
                    <div className="text-sm text-gray-500">{column.columnName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={column.isKey}
                        onChange={async () => {
                          try {
                            const response = await fetch('/api/z_datamanagement/column_config', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                tableName,
                                columnName: column.columnName,
                                isPrimaryKey: !column.isKey,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error('カラム設定の更新に失敗しました');
                            }

                            // データを再取得
                            await fetchData();
                          } catch (error: any) {
                            setError(error.message);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">主キー</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">選択レコードの削除</h3>
            <p className="text-gray-600 mb-6">
              {selectedRows.length}件のレコードを削除します。この操作は取り消せません。
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleting}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteSelectedRecords}
                disabled={deleting}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主キー設定ダイアログ */}
      {showPrimaryKeyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">主キーの設定</h3>
            <p className="text-gray-600 mb-4">
              レコードを削除するには、まず主キーを設定する必要があります。
              主キーとして使用するカラムを選択してください。
            </p>
            <div className="mb-4">
              <select
                className="w-full p-2 border rounded"
                value={selectedPrimaryKey || ''}
                onChange={(e) => setSelectedPrimaryKey(e.target.value)}
              >
                <option value="">カラムを選択</option>
                {columns.map((column) => (
                  <option key={column.columnName} value={column.columnName}>
                    {column.displayName || column.columnName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => {
                  setShowPrimaryKeyDialog(false);
                  setSelectedPrimaryKey(null);
                }}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSetPrimaryKey}
                disabled={!selectedPrimaryKey}
              >
                主キーを設定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}