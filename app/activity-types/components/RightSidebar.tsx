"use client"

import { useColumnSettings } from "./ColumnSettingsContext"

interface RightSidebarProps {
  selectedActivityType?: {
    id: string
    name: string
    description: string
    category: string
    status: string
  }
  filterText: string
  setFilterText: (v: string) => void
  filterCategory: string
  setFilterCategory: (v: string) => void
  uniqueCategories: string[]
}

export default function RightSidebar({ 
  selectedActivityType,
  filterText,
  setFilterText,
  filterCategory,
  setFilterCategory,
  uniqueCategories
}: RightSidebarProps) {
  return (
    <aside className="w-64 border-l h-[calc(100vh-64px)] p-4 bg-gray-50">
      <h3 className="font-medium mb-4">活動タイプ詳細</h3>
      <div className="space-y-4">
        {selectedActivityType ? (
          <>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium mb-2">基本情報</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID</span>
                  <span className="font-medium">{selectedActivityType.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">名称</span>
                  <span className="font-medium">{selectedActivityType.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">カテゴリー</span>
                  <span className="font-medium">{selectedActivityType.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ステータス</span>
                  <span className="font-medium">{selectedActivityType.status}</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium mb-2">説明</h4>
              <p className="text-sm text-gray-600">{selectedActivityType.description}</p>
            </div>
          </>
        ) : (
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">活動タイプを選択してください</p>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="検索..."
          className="w-full pl-8 pr-4 py-2 border rounded-lg text-sm"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <select
          className="w-full px-4 py-2 border rounded-lg text-sm"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">すべてのカテゴリ</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
} 