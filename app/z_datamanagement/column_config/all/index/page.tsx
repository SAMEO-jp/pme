"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function ColumnConfigPage() {
  const [tableData, setTableData] = useState<{
    tableName: string;
    columns: {
      columnName: string;
      displayName: string;
      isKey: boolean;
      columnType: string;
    }[];
  }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTableColumns = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/z_datamanagement/column_config')
        
        if (!response.ok) {
          throw new Error('カラム情報の取得に失敗しました')
        }
        
        const data = await response.json()
        setTableData(data.tables || [])
        setError(null)
      } catch (err) {
        console.error('カラム情報取得エラー:', err)
        setError('データベースからカラム情報を取得できませんでした')
        setTableData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTableColumns()
  }, [])

  // 検索フィルター
  const filteredTableData = tableData.filter(table => 
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => 
      col.columnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">テーブル／カラム設定</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="テーブル・カラム名で検索..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            href="/z_datamanagement/column_config/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            一括編集
          </Link>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-8">
          {filteredTableData.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <p className="text-yellow-700">検索条件に一致するテーブルがありません。</p>
            </div>
          ) : (
            filteredTableData.map((table) => (
              <div key={table.tableName} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{table.tableName}</h2>
                  <Link
                    href={`/z_datamanagement/column_config/${table.tableName}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </Link>
                </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {table.columns.map((column) => (
                        <tr key={column.columnName} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{column.columnName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{column.displayName || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {column.isKey ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                はい
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                いいえ
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{column.columnType || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/z_datamanagement/column_config/${table.tableName}/${column.columnName}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              編集
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
} 