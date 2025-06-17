"use client"

import { useState } from "react"

export function TalentHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">タレントマネジメント</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="社員を検索..."
                className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              新規登録
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 