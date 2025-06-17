"use client"

import { useState } from "react"
import { 
  ListTodo,
  Plus,
  Search,
  Filter
} from "lucide-react"

export default function LeftSidebar() {
  return (
    <aside className="w-64 border-r h-[calc(100vh-64px)] p-4 bg-gray-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">活動タイプ管理</h3>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="検索..."
              className="w-full pl-8 pr-4 py-2 border rounded-lg text-sm"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-2 border rounded-lg text-sm hover:bg-gray-100">
            <Filter className="h-4 w-4" />
            <span>フィルター</span>
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">カテゴリー</h4>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded">
              開発
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded">
              設計
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded">
              テスト
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded">
              運用
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
} 