"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import TableViewGrid from "../../../components/TableViewGrid"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"
import ErrorAlert from "../../../components/ui/ErrorAlert"
import ActionButton from "../../../components/ui/ActionButton"
import TableViewWrapper from "../../../components/layout/TableViewWrapper"
import CsvImportModal from "../../../components/ui/CsvImportModal"
import { X, Download, FileUp, Plus, ColumnsIcon } from "lucide-react"

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
  
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false)
  const [selectedEncoding, setSelectedEncoding] = useState('UTF-8')
  const [isEncodingModalOpen, setIsEncodingModalOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const deleteButtonRef = useRef<HTMLDivElement>(null)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  
  useEffect(() => {
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
        
        // テーブルデータの取得
        const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=200`)
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
    const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=200`)
    if (!dataResponse.ok) {
      throw new Error('テーブルデータの取得に失敗しました')
    }
    
    const tableData = await dataResponse.json()
    setData(tableData.rows || [])

    return result.stats
  }
  
  const handleDeleteRecords = async () => {
    setDeleting(true)
    try {
      const pkColumns = columns.filter(col => col.isKey).map(col => col.columnName)
      const keys = selectedRows.map(row => {
        const obj: any = {}
        pkColumns.forEach(col => { obj[col] = row[col] })
        return obj
      })
      const response = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&keys=${encodeURIComponent(JSON.stringify(keys))}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || '削除に失敗しました')
      // データ再取得
      const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=200`)
      const tableData = await dataResponse.json()
      setData(tableData.rows || [])
      setSelectedRows([])
      setIsDeleteDialogOpen(false)
    } catch (err: any) {
      setError(err.message || '削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAllRecords = async () => {
    setDeletingAll(true)
    try {
      const response = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&all=true`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || '全件削除に失敗しました')
      // データ再取得
      const dataResponse = await fetch(`/api/z_datamanagement/table_data?table=${tableName}&limit=200`)
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
    <div className="w-full h-[calc(90.1vh-1rem)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="h-40" />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : (
          <TableViewGrid
            data={data}
            columns={tableColumns}
            isLoading={false}
            error={null}
            tableName={tableName}
            pageSize={50}
            emptyMessage="このテーブルにはデータがありません"
            headerTitle={<h1 className="text-xl font-bold">テーブル: {tableName}</h1>}
            headerActions={
              <div className="flex gap-2 items-center">
                <ActionButton 
                  href={`/z_datamanagement/table_edit/${tableName}/new`}
                  variant="success"
                  size="small"
                  icon={<Plus size={18} />}
                >
                  新規
                </ActionButton>
                <ActionButton 
                  onClick={() => setIsCsvImportModalOpen(true)}
                  variant="warning"
                  size="small"
                  icon={<Download size={18} className="transform rotate-180" />}>
                  <span className="sr-only">CSVインポート</span>
                </ActionButton>
                <ActionButton 
                  onClick={() => setIsEncodingModalOpen(true)}
                  variant="info"
                  size="small"
                  icon={<Download size={18} />}>
                  <span className="sr-only">CSVダウンロード</span>
                </ActionButton>
              </div>
            }
          />
        )}
      </div>

      <CsvImportModal
        isOpen={isCsvImportModalOpen}
        onClose={() => setIsCsvImportModalOpen(false)}
        onImport={handleCsvImport}
      />

      {/* エンコーディング選択モーダル */}
      {isEncodingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">CSVダウンロード</h2>
              <button
                onClick={() => setIsEncodingModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="encoding"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                文字エンコーディング
              </label>
              <select
                id="encoding"
                value={selectedEncoding}
                onChange={(e) => setSelectedEncoding(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ENCODING_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEncodingModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCsvDownload()
                  setIsEncodingModalOpen(false)
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                ダウンロード
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">選択レコード削除</h2>
            </div>
            <div className="mb-4">
              <p>本当に{selectedRows.length}件のレコードを削除しますか？この操作は元に戻せません。</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={deleting}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDeleteRecords}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全件削除確認ダイアログ */}
      {isDeleteAllDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">全件削除</h2>
            </div>
            <div className="mb-4">
              <p>本当にこのテーブルの全レコードを削除しますか？この操作は元に戻せません。</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteAllDialogOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={deletingAll}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDeleteAllRecords}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={deletingAll}
              >
                {deletingAll ? '削除中...' : '全件削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}