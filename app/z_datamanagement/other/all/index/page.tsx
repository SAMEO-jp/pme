"use client"

import { useState } from "react"
import Link from "next/link"
import CreateDatabaseModal from "../../../components/ui/CreateDatabaseModal"

export default function OtherPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateDatabase = async (databaseName: string) => {
    const response = await fetch("/api/z_datamanagement/create_database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "データベースの作成に失敗しました")
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">その他の機能</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">データベース作成</h2>
          <p className="text-gray-600 mb-4">
            新しいデータベースを作成します。
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            新規作成
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">データベース情報</h2>
          <p className="text-gray-600 mb-4">
            データベースの構造や統計情報を確認できます。
          </p>
          <Link
            href="/z_datamanagement/other/db_info/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            詳細を表示
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">データエクスポート</h2>
          <p className="text-gray-600 mb-4">
            テーブルデータをCSV形式でエクスポートします。
          </p>
          <Link
            href="/z_datamanagement/other/export/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            エクスポート
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">データインポート</h2>
          <p className="text-gray-600 mb-4">
            CSVファイルからデータをインポートします。
          </p>
          <Link
            href="/z_datamanagement/other/import/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            インポート
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">バックアップ</h2>
          <p className="text-gray-600 mb-4">
            データベースのバックアップを作成・管理します。
          </p>
          <Link
            href="/z_datamanagement/other/backup/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            バックアップ管理
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">SQL実行</h2>
          <p className="text-gray-600 mb-4">
            カスタムSQLクエリを実行できます。
          </p>
          <Link
            href="/z_datamanagement/other/sql/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            SQLエディタ
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">ログ</h2>
          <p className="text-gray-600 mb-4">
            システムログとデータ変更履歴を確認できます。
          </p>
          <Link
            href="/z_datamanagement/other/logs/index"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ログ表示
          </Link>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">メンテナンス作業</h2>
          <p className="text-blue-700 mb-4">
            以下の操作はデータベースに直接影響を与えます。操作前にバックアップを取ることをお勧めします。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/z_datamanagement/other/vacuum/index"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              VACUUM実行
            </Link>
            <Link
              href="/z_datamanagement/other/optimize/index"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              最適化
            </Link>
            <Link
              href="/z_datamanagement/other/reset_column_info/index"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              カラム情報リセット
            </Link>
          </div>
        </div>
      </div>

      <CreateDatabaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDatabase}
      />
    </div>
  )
} 