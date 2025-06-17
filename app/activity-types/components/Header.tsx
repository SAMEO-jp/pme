"use client"

import { 
  ArrowLeft,
  Settings,
  Download,
  Upload,
  MoreVertical
} from "lucide-react"
import Link from "next/link"
import { useColumnSettings } from "./ColumnSettingsContext"

export default function Header() {
  const { setShowColumnSettings } = useColumnSettings()

  return (
    <header className="border-b p-4 bg-white">
      <div className="flex items-center justify-center relative">
        <Link 
          href="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0"
          title="戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-row items-baseline gap-4 mx-auto">
          <h1 className="text-xl font-semibold">活動タイプマスター管理/<span className="text-base text-gray-500 ml-2">m_activity_types</span></h1>
        </div>
        <div className="flex items-center gap-2 absolute right-0">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="インポート"
          >
            <Upload className="h-5 w-5" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="エクスポート"
          >
            <Download className="h-5 w-5" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="設定"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="その他"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
} 