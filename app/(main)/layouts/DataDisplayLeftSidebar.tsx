"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  BarChart2, 
  Calendar, 
  Briefcase,
  ChevronDown
} from "lucide-react"

interface DataDisplayLeftSidebarProps {
  currentYear: number
  currentMonth: number
  currentWeek: number
}

export default function DataDisplayLeftSidebar({ currentYear, currentMonth, currentWeek }: DataDisplayLeftSidebarProps) {
  // サイドバーの状態
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    management: true,
    projects: false,
    other: false,
    settings: false,
  })

  // メニューの展開/折りたたみを切り替える
  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <aside className="w-64 border-r h-[calc(100vh-64px)] p-4 bg-gray-50">
      <h3 className="font-medium mb-4">メニュー</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
            <BarChart2 className="h-4 w-4 mr-2" />
            <span>ダッシュボード</span>
          </Link>
        </li>
        <li>
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-200 rounded cursor-pointer"
            onClick={() => toggleMenu("management")}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>実績管理</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedMenus.management ? "rotate-180" : ""}`}
            />
          </div>
          {expandedMenus.management && (
            <ul className="ml-4 mt-1 space-y-1">
              <li>
                <Link
                  href={`/data-display/${currentYear}/${currentMonth}`}
                  className="block p-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-blue-600"
                >
                  データ表示
                </Link>
              </li>
              <li>
                <Link
                  href={`/week-shiwake/${currentYear}/${currentWeek}`}
                  className="block p-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-blue-600"
                >
                  週別表示
                </Link>
              </li>
              <li>
                <Link
                  href="/activity-types"
                  className="block p-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-blue-600"
                >
                  活動タイプ管理
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-200 rounded cursor-pointer"
            onClick={() => toggleMenu("projects")}
          >
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>プロジェクト</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedMenus.projects ? "rotate-180" : ""}`}
            />
          </div>
          {expandedMenus.projects && (
            <ul className="ml-4 mt-1 space-y-1">
              <li>
                <Link
                  href="/projects"
                  className="block p-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-blue-600"
                >
                  プロジェクト管理
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/purchase"
                  className="block p-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-blue-600"
                >
                  購入品管理
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  )
} 