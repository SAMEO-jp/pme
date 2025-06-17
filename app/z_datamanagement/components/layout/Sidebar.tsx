"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, Table2, Settings, FileCog, Home, MoreHorizontal, Search } from "lucide-react"

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname()
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/z_datamanagement/tables')
        
        if (!response.ok) {
          throw new Error('テーブル情報の取得に失敗しました')
        }
        
        const data = await response.json()
        setTables(data.tables || [])
        setError(null)
      } catch (err) {
        console.error('テーブル情報取得エラー:', err)
        setError('テーブル一覧を取得できませんでした')
        setTables([])
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  // 検索フィルター
  const filteredTables = tables.filter(
    table => table.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isActiveLink = (path: string) => {
    return pathname.startsWith(path)
  }

  const mainMenuItems = [
    {
      name: "メイン",
      icon: <Home size={18} />,
      path: "/z_datamanagement/main/all/index",
    },
    {
      name: "テーブル/カラム設定",
      icon: <FileCog size={18} />,
      path: "/z_datamanagement/column_config/all/index",
    },
    {
      name: "その他機能",
      icon: <MoreHorizontal size={18} />,
      path: "/z_datamanagement/other/all/index",
    }
  ]

  return (
    <aside className={`w-64 bg-gray-50 border-r h-screen overflow-y-auto ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="mr-2" size={20} />
          データベース管理
        </h2>
        
        <nav className="mb-6">
          <ul className="space-y-1">
            {mainMenuItems.map(item => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActiveLink(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700 flex items-center">
              <Table2 size={16} className="mr-2" />
              テーブル一覧
            </h3>
          </div>
          
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="テーブル検索..."
              className="w-full pl-8 pr-3 py-1 border rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          {loading ? (
            <div className="py-2 px-3 text-sm text-gray-500">読み込み中...</div>
          ) : error ? (
            <div className="py-2 px-3 text-sm text-red-500">{error}</div>
          ) : filteredTables.length === 0 ? (
            <div className="py-2 px-3 text-sm text-gray-500">
              {searchTerm ? "一致するテーブルがありません" : "テーブルがありません"}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {filteredTables.map(table => (
                  <li key={table}>
                    <Link
                      href={`/z_datamanagement/table_view/${table}/index`}
                      className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                        pathname.includes(`/table_view/${table}/`)
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {table}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <Link
            href="/z_datamanagement/other/db_info/index"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-200"
          >
            <Settings size={16} className="mr-2" />
            DB情報・詳細設定
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 