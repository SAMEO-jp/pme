"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ImportStats {
  inserted: number
  updated: number
  skipped: number
}

interface ImportOptions {
  noDuplicates: boolean
  createNewTable: boolean
  encoding: string
}

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File, options: ImportOptions) => Promise<ImportStats>
  tableName: string
}

const ENCODING_OPTIONS = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'Shift_JIS', label: 'Shift_JIS' },
  { value: 'EUC-JP', label: 'EUC-JP' },
  { value: 'ISO-8859-1', label: 'ISO-8859-1' }
]

export default function CsvImportModal({
  isOpen,
  onClose,
  onImport,
  tableName
}: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [options, setOptions] = useState<ImportOptions>({
    noDuplicates: false,
    createNewTable: false,
    encoding: 'UTF-8'
  })

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("CSVファイルのみアップロード可能です")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
      setImportStats(null)
    }
  }

  const handleOptionChange = (option: keyof ImportOptions, value?: string) => {
    setOptions(prev => ({
      ...prev,
      [option]: value !== undefined ? value : !prev[option]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("ファイルを選択してください")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const stats = await onImport(file, options)
      setImportStats(stats)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "インポートに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">CSVファイルをインポート - {tableName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="csvFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CSVファイルを選択
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              value={options.encoding}
              onChange={(e) => handleOptionChange('encoding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ENCODING_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.noDuplicates}
                onChange={() => handleOptionChange('noDuplicates')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">重複を許さない（重複データはスキップ）</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.createNewTable}
                onChange={() => handleOptionChange('createNewTable')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">完全に新規テーブルとしてインポート</span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {importStats && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              <p className="font-medium mb-1">インポート結果:</p>
              <ul className="list-disc list-inside">
                <li>新規追加: {importStats.inserted}件</li>
                <li>更新: {importStats.updated}件</li>
                <li>スキップ: {importStats.skipped}件</li>
              </ul>
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
              disabled={isLoading || !file}
            >
              {isLoading ? "インポート中..." : "インポート"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 