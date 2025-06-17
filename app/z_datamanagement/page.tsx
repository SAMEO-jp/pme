"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import CreateTableModal from "@/app/z_datamanagement/components/ui/CreateTableModal"
import { ArrowUpDown } from "lucide-react"

interface TableInfo {
  name: string
  kind: string | null
  tablename_yomi: string | null
}

type SortField = 'name' | 'tablename_yomi' | 'kind'
type SortOrder = 'asc' | 'desc'

export default function DataManagementMainPage() {
  const params = useParams()
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // paramsの値を確認
  console.log('params:', params)
  console.log('params.kind:', params.kind)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/z_datamanagement/tables')
        
        if (!response.ok) {
          throw new Error('テーブル情報の取得に失敗しました')
        }
        
        const data = await response.json()
        console.log('取得したテーブルデータ:', data.tables) // デバッグ用
        setTables(data.tables || [])
        setError(null)
      } catch (err) {
        console.error('テーブル情報取得エラー:', err)
        setError('データベースからテーブル情報を取得できませんでした')
        setTables([])
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  const handleCreateTable = async (tableName: string, columns: any[]) => {
    const response = await fetch("/api/z_datamanagement/create_table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableName, columns }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "テーブルの作成に失敗しました")
    }

    // テーブル一覧を更新
    const tablesResponse = await fetch('/api/z_datamanagement/tables')
    if (tablesResponse.ok) {
      const data = await tablesResponse.json()
      setTables(data.tables || [])
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // テーブルをソート
  const sortedTables = [...tables].sort((a, b) => {
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  // 表示するテーブルをフィルタリング
  const filteredTables = sortedTables.filter(table => {
    const currentKind = params.kind as string
    console.log('現在の種別:', currentKind) // デバッグ用
    console.log('テーブルの種別:', table.kind) // デバッグ用

    // デフォルトで'all'を設定
    if (!currentKind) return true
    if (currentKind === 'all') return true
    if (currentKind === 'kinds') return table.kind !== null && table.kind !== ''
    return table.kind === currentKind
  })

  console.log('フィルタリング後のテーブル:', filteredTables) // デバッグ用

  return (
    <div>
      <div className="container mx-auto">
        <div className="relative flex items-center justify-center h-16 mb-6">
          <h1 className="text-2xl font-bold">データ管理システム</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="absolute right-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            新規テーブル作成
          </button>
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
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              {!params.kind || params.kind === 'all' ? 'すべてのテーブル' : 
               params.kind === 'kinds' ? '種別が設定されているテーブル' :
               `${params.kind}のテーブル`}
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>テーブル名</span>
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('tablename_yomi')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>読み仮名</span>
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('kind')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>種別</span>
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTables.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          テーブルが見つかりません
                        </td>
                      </tr>
                    ) : (
                      filteredTables.map((table) => (
                        <tr key={table.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{table.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{table.tablename_yomi || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{table.kind || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`/z_datamanagement/table_view/${table.name}/index`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              表示
                            </Link>
                            <Link
                              href={`/z_datamanagement/table_edit/${table.name}/index`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              編集
                            </Link>
                            <Link
                              href={`/z_datamanagement/column_config/${table.name}/index`}
                              className="text-green-600 hover:text-green-900"
                            >
                              カラム設定
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <CreateTableModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTable}
        />
      </div>
    </div>
  )
} 