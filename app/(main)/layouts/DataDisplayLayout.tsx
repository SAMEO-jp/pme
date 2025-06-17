"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { 
  User, 
  LogIn, 
  Settings
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import DataDisplayHeader, { Column } from "./DataDisplayHeader"
import DataDisplayLeftSidebar from "./DataDisplayLeftSidebar"
import DataDisplayRightSidebar from "./DataDisplayRightSidebar"
import { ViewModeContext } from "../contexts/ViewModeContext"

export default function DataDisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // URLから年と月を抽出
  const match = pathname.match(/\/data-display\/(\d+)\/(\d+)/)
  const year = match ? Number.parseInt(match[1]) : new Date().getFullYear()
  const month = match ? Number.parseInt(match[2]) : new Date().getMonth() + 1

  // 月の名前を取得
  const monthName = new Date(year, month - 1, 1).toLocaleString("ja-JP", { month: "long" })
  
  // 現在の年月を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentWeek = getWeekNumber(currentDate)

  // ユーザー情報の状態
  const [currentUser, setCurrentUser] = useState({ employeeNumber: "999999", name: "仮ログイン" })
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  // ビューモードの状態
  const [viewMode, setViewMode] = useState("table")
  
  // データテーブルの情報
  const [columns, setColumns] = useState<Column[]>([])
  const [downloadCSV, setDownloadCSV] = useState<(() => void) | undefined>(undefined)
  
  // ユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()
        if (data.success) {
          setCurrentUser(data.data)
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
      }
    }

    fetchCurrentUser()
  }, [])
  
  // カスタムイベントの購読
  useEffect(() => {
    const handleUpdateHeaderData = (event: CustomEvent) => {
      const { columns, setColumns, downloadCSV } = event.detail
      if (columns) setColumns(columns)
      if (downloadCSV) setDownloadCSV(() => downloadCSV)
    }
    
    document.addEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    
    return () => {
      document.removeEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    }
  }, [])

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      <div className="flex flex-col h-screen">
        <header className="border-b p-0">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold hover:text-gray-600 transition-colors p-4">
                実績保管アプリ
              </Link>

              {/* ユーザー情報表示 */}
              <div className="flex items-center border-l pl-4">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium">{currentUser.name}</span>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100"
                  title="ユーザー切替"
                >
                  <LogIn className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* data-displayヘッダーコンポーネント */}
            <DataDisplayHeader 
              year={year} 
              month={month} 
              monthName={monthName} 
              viewMode={viewMode}
              setViewMode={setViewMode}
              columns={columns}
              setColumns={setColumns}
              onDownloadCSV={downloadCSV}
            />

            <div className="flex items-center gap-2 pr-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex flex-1">
          {/* 左サイドバー */}
          <DataDisplayLeftSidebar 
            currentYear={currentYear}
            currentMonth={currentMonth}
            currentWeek={currentWeek}
          />
          
          {/* メインコンテンツ */}
          <main className="flex-1 p-4">{children}</main>
          
          {/* 右サイドバー */}
          <DataDisplayRightSidebar />
        </div>
      </div>
    </ViewModeContext.Provider>
  )
}

// 週番号を取得する関数
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
} 