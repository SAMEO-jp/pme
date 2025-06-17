"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

interface Column {
  name: string
  type: string
  isPrimary: boolean
  isNullable: boolean
  defaultValue?: string
}

interface CreateTableModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tableName: string, columns: Column[]) => Promise<void>
}

const COLUMN_TYPES = [
  "INTEGER",
  "TEXT",
  "REAL",
  "BLOB",
  "NUMERIC",
  "BOOLEAN",
  "DATE",
  "DATETIME"
]

export default function CreateTableModal({
  isOpen,
  onClose,
  onSubmit
}: CreateTableModalProps) {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<Column[]>([
    { name: "", type: "TEXT", isPrimary: false, isNullable: true }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "TEXT", isPrimary: false, isNullable: true }])
  }

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const handleColumnChange = (index: number, field: keyof Column, value: any) => {
    const newColumns = [...columns]
    newColumns[index] = { ...newColumns[index], [field]: value }
    setColumns(newColumns)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    if (!tableName.trim()) {
      setError("テーブル名を入力してください")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      setError("テーブル名は英数字とアンダースコアのみ使用可能です")
      return
    }

    const emptyColumns = columns.filter(col => !col.name.trim())
    if (emptyColumns.length > 0) {
      setError("すべてのカラム名を入力してください")
      return
    }

    const duplicateColumns = columns.filter((col, index) => 
      columns.findIndex(c => c.name === col.name) !== index
    )
    if (duplicateColumns.length > 0) {
      setError("カラム名が重複しています")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await onSubmit(tableName, columns)
      setTableName("")
      setColumns([{ name: "", type: "TEXT", isPrimary: false, isNullable: true }])
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "テーブルの作成に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">新しいテーブルを作成</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="tableName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              テーブル名
            </label>
            <input
              type="text"
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="新しいテーブル名を入力"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">カラム定義</h3>
              <button
                type="button"
                onClick={handleAddColumn}
                className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1" />
                カラムを追加
              </button>
            </div>

            <div className="space-y-4">
              {columns.map((column, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カラム名
                    </label>
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="カラム名を入力"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      データ型
                    </label>
                    <select
                      value={column.type}
                      onChange={(e) => handleColumnChange(index, "type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {COLUMN_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.isPrimary}
                        onChange={(e) => handleColumnChange(index, "isPrimary", e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">主キー</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.isNullable}
                        onChange={(e) => handleColumnChange(index, "isNullable", e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">NULL許容</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(index)}
                      className="text-red-600 hover:text-red-700"
                      disabled={columns.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 