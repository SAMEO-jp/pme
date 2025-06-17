"use client"

import { useState } from "react"
import Header from "./components/Header"
import LeftSidebar from "./components/LeftSidebar"
import RightSidebar from "./components/RightSidebar"
import { ColumnSettingsProvider } from "./components/ColumnSettingsContext"
import { useColumnSettings } from "./components/ColumnSettingsContext"

// メインコンテンツを別コンポーネントとして分離
function MainContent({ children }: { children: React.ReactNode }) {
  const { showColumnSettings, setShowColumnSettings } = useColumnSettings()

  return (
    <main className="flex-1 p-4">
      {children}
    </main>
  )
}

export default function ActivityTypesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 選択された活動タイプの状態
  const [selectedActivityType, setSelectedActivityType] = useState<{
    id: string
    name: string
    description: string
    category: string
    status: string
  } | null>(null)

  // フィルター関連の状態
  const [filterText, setFilterText] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [uniqueCategories] = useState<string[]>([])

  return (
    <ColumnSettingsProvider>
      <div className="flex flex-col h-screen">
        {/* ヘッダー */}
        <Header />
        
        <div className="flex flex-1">
          {/* 左サイドバー */}
          <LeftSidebar />
          
          {/* メインコンテンツ */}
          <MainContent>{children}</MainContent>
          
          {/* 右サイドバー */}
          <RightSidebar 
            selectedActivityType={selectedActivityType || undefined}
            filterText={filterText}
            setFilterText={setFilterText}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            uniqueCategories={uniqueCategories}
          />
        </div>
      </div>
    </ColumnSettingsProvider>
  )
} 