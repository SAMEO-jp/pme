"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, FolderOpen, Settings, FileText, Database, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  expandedMenus: Record<string, boolean>
  onMenuToggle: (menu: string) => void
  currentYear: number
  currentMonth: number
  currentWeek: number
}

export function Sidebar({
  expandedMenus,
  onMenuToggle,
  currentYear,
  currentMonth,
  currentWeek,
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-800 border-r h-screen">
      <nav className="p-4">
        {/* 管理メニュー */}
        <div className="mb-4">
          <button
            onClick={() => onMenuToggle("management")}
            className="flex items-center w-full text-left p-2 hover:bg-gray-700 rounded text-gray-200"
          >
            {expandedMenus.management ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            <FolderOpen className="h-4 w-4 mr-2" />
            <span>管理</span>
          </button>
          {expandedMenus.management && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                href="/file-management"
                className={cn(
                  "flex items-center p-2 rounded transition-colors",
                  pathname === "/file-management"
                    ? "text-blue-400 font-bold"
                    : "text-gray-100 hover:text-white"
                )}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>ファイル管理</span>
              </Link>
              <Link
                href="/data-management"
                className={cn(
                  "flex items-center p-2 rounded transition-colors",
                  pathname === "/data-management"
                    ? "text-blue-400 font-bold"
                    : "text-gray-100 hover:text-white"
                )}
              >
                <Database className="h-4 w-4 mr-2" />
                <span>データ管理</span>
              </Link>
            </div>
          )}
        </div>

        {/* プロジェクトメニュー */}
        <div className="mb-4">
          <button
            onClick={() => onMenuToggle("projects")}
            className="flex items-center w-full text-left p-2 hover:bg-gray-700 rounded text-gray-200"
          >
            {expandedMenus.projects ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            <Users className="h-4 w-4 mr-2" />
            <span>プロジェクト</span>
          </button>
          {expandedMenus.projects && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                href={`/week-shiwake/${currentYear}/${currentWeek}`}
                className={cn(
                  "flex items-center p-2 rounded transition-colors",
                  pathname.startsWith("/week-shiwake")
                    ? "text-blue-400 font-bold"
                    : "text-gray-100 hover:text-white"
                )}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>週次仕訳</span>
              </Link>
            </div>
          )}
        </div>

        {/* 設定メニュー */}
        <div>
          <button
            onClick={() => onMenuToggle("settings")}
            className="flex items-center w-full text-left p-2 hover:bg-gray-700 rounded text-gray-200"
          >
            {expandedMenus.settings ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            <Settings className="h-4 w-4 mr-2" />
            <span>設定</span>
          </button>
          {expandedMenus.settings && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                href="/settings"
                className={cn(
                  "flex items-center p-2 rounded transition-colors",
                  pathname === "/settings"
                    ? "text-blue-400 font-bold"
                    : "text-gray-100 hover:text-white"
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>システム設定</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
} 