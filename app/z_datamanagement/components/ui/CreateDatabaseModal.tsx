"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface CreateDatabaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (databaseName: string) => Promise<void>
}

export default function CreateDatabaseModal({
  isOpen,
  onClose,
  onSubmit
}: CreateDatabaseModalProps) {
  const [databaseName, setDatabaseName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!databaseName.trim()) {
      setError("データベース名を入力してください")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await onSubmit(databaseName)
      setDatabaseName("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "データベースの作成に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">新しいデータベースを作成</h2>
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
              htmlFor="databaseName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              データベース名
            </label>
            <input
              type="text"
              id="databaseName"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="新しいデータベース名を入力"
            />
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