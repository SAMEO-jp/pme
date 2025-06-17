"use client"

import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import Link from "next/link"

export interface Column {
  id: string;
  name: string;
  checked: boolean;
  category?: string;
}

interface DataDisplayHeaderProps {
  year: number
  month: number
  monthName: string
  viewMode: string
  setViewMode: (mode: string) => void
  columns?: Column[]
  setColumns?: (columns: Column[]) => void
  onDownloadCSV?: () => void
}

export default function DataDisplayHeader({ 
  year, 
  month, 
  monthName,
  viewMode,
  setViewMode,
  columns,
  setColumns,
  onDownloadCSV
}: DataDisplayHeaderProps) {
  // 前月と翌月のリンクを計算
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  return (
    <div className="grid grid-cols-3 items-center mx-6">
      <div className="flex items-center">
        <div className="flex items-center rounded-md overflow-hidden">
          <Link
            href={`/data-display/${prevYear}/${prevMonth}`}
            className="p-1.5 hover:bg-gray-100 flex items-center justify-center"
            aria-label="前月"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          
          <span className="px-6 font-semibold text-lg flex items-center">
            {year}年 {month}月のデータ
          </span>
          
          <Link
            href={`/data-display/${nextYear}/${nextMonth}`}
            className="p-1.5 hover:bg-gray-100 flex items-center justify-center"
            aria-label="翌月"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      <div className="flex justify-end items-center space-x-3">
        {/* CSV出力ボタン */}
        {onDownloadCSV && (
          <button
            onClick={onDownloadCSV}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5 text-gray-600" />
            CSV出力
          </button>
        )}
        
        {/* ビューモード切替タブ */}
        <div className="border rounded-md overflow-hidden">
          <button
            className={`py-1.5 px-3 ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
            onClick={() => setViewMode("table")}
          >
            表形式
          </button>
          <button
            className={`py-1.5 px-3 ${viewMode === "calendar" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
            onClick={() => setViewMode("calendar")}
          >
            出退勤表
          </button>
          <button
            className={`py-1.5 px-3 ${viewMode === "chart" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
            onClick={() => setViewMode("chart")}
          >
            グラフ
          </button>
        </div>
      </div>
    </div>
  )
} 