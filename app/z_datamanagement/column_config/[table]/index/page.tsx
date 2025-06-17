"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, Plus, X } from "lucide-react"
import ActionButton from "@/app/z_datamanagement/components/ui/ActionButton"
import LoadingSpinner from "@/app/z_datamanagement/components/ui/LoadingSpinner"
import ErrorAlert from "@/app/z_datamanagement/components/ui/ErrorAlert"
import DataCard from "@/app/z_datamanagement/components/ui/DataCard"
import CsvImportModal from "@/app/z_datamanagement/components/ui/CsvImportModal"

interface ColumnConfig {
  columnName: string
  displayName: string
  isKey: boolean
  columnType: string
  newColumnName?: string  // カラム名変更用
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

export default function TableColumnConfigPage() {
  const params = useParams()
  const router = useRouter()
  const tableName = params.table as string
  
  const [columns, setColumns] = useState<ColumnConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedColumns, setEditedColumns] = useState<ColumnConfig[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false)
  const [selectedEncoding, setSelectedEncoding] = useState('UTF-8')
  const [newColumn, setNewColumn] = useState<ColumnConfig>({
    columnName: "",
    displayName: "",
    isKey: false,
    columnType: "TEXT"
  })
  const [isEncodingModalOpen, setIsEncodingModalOpen] = useState(false)
  
  useEffect(() => {
    const fetchColumnData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/z_datamanagement/column_config?table=${tableName}`)
        
        if (!response.ok) {
          throw new Error('カラム設定の取得に失敗しました')
        }
        
        const data = await response.json()
        const tableInfo = data.tables.find((t: any) => t.tableName === tableName)
        
        if (!tableInfo) {
          throw new Error('テーブル情報が見つかりませんでした')
        }
        
        setColumns(tableInfo.columns)
        setEditedColumns(tableInfo.columns)
        setError(null)
      } catch (err) {
        console.error('カラム設定取得エラー:', err)
        setError(`テーブル「${tableName}」のカラム設定を取得できませんでした`)
        setColumns([])
        setEditedColumns([])
      } finally {
        setLoading(false)
      }
    }

    if (tableName) {
      fetchColumnData()
    }
  }, [tableName])
  
  const handleColumnChange = async (index: number, field: keyof ColumnConfig, value: any) => {
    const newColumns = [...editedColumns]
    if (field === 'columnName') {
      // カラム名を変更する場合は、newColumnNameに設定
      newColumns[index] = { 
        ...newColumns[index], 
        newColumnName: value
      }
    } else if (field === 'isKey') {
      // 主キーの設定を変更する場合
      try {
        const response = await fetch('/api/z_datamanagement/column_config/set_primary_key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableName,
            columnName: newColumns[index].columnName,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || '主キーの設定に失敗しました')
        }

        // 主キー設定を更新
        newColumns.forEach((col, i) => {
          col.isKey = i === index
        })
      } catch (error: any) {
        setError(error.message)
        return
      }
    } else {
      newColumns[index] = { ...newColumns[index], [field]: value }
    }
    setEditedColumns(newColumns)
  }

  const handleNewColumnChange = (field: keyof ColumnConfig, value: any) => {
    setNewColumn(prev => ({ ...prev, [field]: value }))
  }

  const handleAddColumn = async () => {
    try {
      // バリデーション
      if (!newColumn.columnName.trim()) {
        setError("カラム名を入力してください")
        return
      }

      if (!/^[a-zA-Z0-9_]+$/.test(newColumn.columnName)) {
        setError("カラム名は英数字とアンダースコアのみ使用可能です")
        return
      }

      if (editedColumns.some(col => col.columnName === newColumn.columnName)) {
        setError("このカラム名は既に使用されています")
        return
      }

      setSaving(true)
      setSaveError(null)

      const response = await fetch('/api/z_datamanagement/column_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          columnName: newColumn.columnName,
          displayName: newColumn.displayName,
          isKey: newColumn.isKey,
          columnType: newColumn.columnType
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'カラムの追加に失敗しました')
      }

      // 保存完了後に最新データを再取得
      const updatedResponse = await fetch(`/api/z_datamanagement/column_config?table=${tableName}`)
      const updatedData = await updatedResponse.json()
      const tableInfo = updatedData.tables.find((t: any) => t.tableName === tableName)
      
      if (tableInfo) {
        setColumns(tableInfo.columns)
        setEditedColumns(tableInfo.columns)
      }

      // 新規カラムフォームをリセット
      setNewColumn({
        columnName: "",
        displayName: "",
        isKey: false,
        columnType: "TEXT"
      })
      setShowAddColumn(false)
    } catch (err) {
      console.error('カラム追加エラー:', err)
      setSaveError(err instanceof Error ? err.message : 'カラムの追加に失敗しました')
    } finally {
      setSaving(false)
    }
  }
  
  const saveChanges = async () => {
    try {
      setSaving(true)
      setSaveError(null)
      
      // 変更されたカラムのみ保存
      for (const column of editedColumns) {
        const originalColumn = columns.find(c => c.columnName === column.columnName)
        
        // 変更がない場合はスキップ
        if (
          originalColumn &&
          originalColumn.displayName === column.displayName &&
          originalColumn.isKey === column.isKey &&
          originalColumn.columnType === column.columnType
        ) {
          continue
        }
        
        const response = await fetch('/api/z_datamanagement/column_config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableName,
            columnName: column.columnName,
            displayName: column.displayName,
            isKey: column.isKey,
            columnType: column.columnType
          }),
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || '保存に失敗しました')
        }
      }
      
      // 保存完了後に最新データを再取得
      const response = await fetch(`/api/z_datamanagement/column_config?table=${tableName}`)
      const data = await response.json()
      const tableInfo = data.tables.find((t: any) => t.tableName === tableName)
      
      if (tableInfo) {
        setColumns(tableInfo.columns)
        setEditedColumns(tableInfo.columns)
      }
      
      setEditMode(false)
    } catch (err) {
      console.error('カラム設定保存エラー:', err)
      setSaveError(err instanceof Error ? err.message : '設定の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }
  
  const cancelEdit = () => {
    setEditedColumns([...columns])
    setEditMode(false)
    setSaveError(null)
    setShowAddColumn(false)
  }
  
  // CSVダウンロード処理
  const handleCsvDownload = async () => {
    try {
      const response = await fetch(`/api/z_datamanagement/column_config/csv?table=${tableName}&encoding=${selectedEncoding}`)
      if (!response.ok) {
        throw new Error('CSVのダウンロードに失敗しました')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tableName}_columns.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('CSVダウンロードエラー:', err)
      setError('CSVのダウンロードに失敗しました')
    }
  }

  // CSVインポート処理
  const handleCsvImport = async (file: File, options: ImportOptions): Promise<ImportStats> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('options', JSON.stringify(options))

    const response = await fetch(`/api/z_datamanagement/column_config/csv?table=${tableName}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'CSVのインポートに失敗しました')
    }

    const result = await response.json()

    // データを再取得
    const columnsResponse = await fetch(`/api/z_datamanagement/column_config?table=${tableName}`)
    if (!columnsResponse.ok) {
      throw new Error('カラム情報の取得に失敗しました')
    }
    
    const columnsData = await columnsResponse.json()
    const tableInfo = columnsData.tables.find((t: any) => t.tableName === tableName)
    
    if (tableInfo) {
      setColumns(tableInfo.columns)
      setEditedColumns(tableInfo.columns)
    }

    return result.stats
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ActionButton 
            href="/z_datamanagement/column_config/all/index"
            variant="secondary"
            size="small"
            icon={<ArrowLeft size={16} />}
          >
            戻る
          </ActionButton>
          <h1 className="text-2xl font-bold">テーブル: {tableName} のカラム設定</h1>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <ActionButton 
                onClick={() => setIsEncodingModalOpen(true)}
                variant="primary"
                size="small"
              >
                CSVカラムダウンロード
              </ActionButton>
              <ActionButton 
                onClick={() => setIsCsvImportModalOpen(true)}
                variant="primary"
                size="small"
              >
                CSVカラムアップロード
              </ActionButton>
              <ActionButton 
                onClick={() => setEditMode(true)}
                variant="primary"
                icon={<Edit size={18} />}
              >
                編集モード
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton 
                onClick={cancelEdit}
                variant="secondary"
              >
                キャンセル
              </ActionButton>
              <ActionButton 
                onClick={saveChanges}
                variant="success"
                isLoading={saving}
                icon={<Save size={18} />}
              >
                保存
              </ActionButton>
            </>
          )}
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner className="h-40" />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          {saveError && (
            <ErrorAlert message={saveError} className="mb-4" onDismiss={() => setSaveError(null)} />
          )}
          
          <DataCard title="カラム設定" className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カラム名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      表示名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      主キー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      データ型
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editedColumns.map((column, index) => (
                    <tr key={column.columnName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            defaultValue={column.columnName}
                            onChange={(e) => handleColumnChange(index, 'columnName', e.target.value)}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{column.columnName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            value={column.displayName}
                            onChange={(e) => handleColumnChange(index, 'displayName', e.target.value)}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{column.displayName || '-'}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5"
                            checked={column.isKey}
                            onChange={(e) => handleColumnChange(index, 'isKey', e.target.checked)}
                          />
                        ) : (
                          column.isKey ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              はい
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              いいえ
                            </span>
                          )
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode ? (
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={column.columnType}
                            onChange={(e) => handleColumnChange(index, 'columnType', e.target.value)}
                          >
                            <option value="TEXT">TEXT</option>
                            <option value="INTEGER">INTEGER</option>
                            <option value="REAL">REAL</option>
                            <option value="BLOB">BLOB</option>
                            <option value="NUMERIC">NUMERIC</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                            <option value="DATE">DATE</option>
                            <option value="DATETIME">DATETIME</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{column.columnType || '-'}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editMode && !showAddColumn && (
              <div className="mt-4">
                <ActionButton
                  onClick={() => setShowAddColumn(true)}
                  variant="primary"
                  size="small"
                  icon={<Plus size={16} />}
                >
                  カラムを追加
                </ActionButton>
              </div>
            )}

            {editMode && showAddColumn && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">新規カラムの追加</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カラム名
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newColumn.columnName}
                      onChange={(e) => handleNewColumnChange('columnName', e.target.value)}
                      placeholder="カラム名を入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      表示名
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newColumn.displayName}
                      onChange={(e) => handleNewColumnChange('displayName', e.target.value)}
                      placeholder="表示名を入力（任意）"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      データ型
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newColumn.columnType}
                      onChange={(e) => handleNewColumnChange('columnType', e.target.value)}
                    >
                      <option value="TEXT">TEXT</option>
                      <option value="INTEGER">INTEGER</option>
                      <option value="REAL">REAL</option>
                      <option value="BLOB">BLOB</option>
                      <option value="NUMERIC">NUMERIC</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="DATE">DATE</option>
                      <option value="DATETIME">DATETIME</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-5 w-5 mr-2"
                        checked={newColumn.isKey}
                        onChange={(e) => handleNewColumnChange('isKey', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">主キー</span>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <ActionButton
                    onClick={() => setShowAddColumn(false)}
                    variant="secondary"
                    size="small"
                  >
                    キャンセル
                  </ActionButton>
                  <ActionButton
                    onClick={handleAddColumn}
                    variant="success"
                    size="small"
                    isLoading={saving}
                  >
                    追加
                  </ActionButton>
                </div>
              </div>
            )}
          </DataCard>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">設定情報</h3>
            <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>表示名はUI上で表示される列名です。設定しない場合はカラム名がそのまま表示されます。</li>
              <li>主キーの設定はデータベース上の主キー制約には影響しません。表示や編集画面での扱いのみに影響します。</li>
              <li>データ型の変更は、表示方法やフォームの入力タイプに影響します。実際のデータベースのカラム型は変更されません。</li>
            </ul>
          </div>
        </>
      )}
      
      {/* CSVインポートモーダル */}
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
    </div>
  )
} 