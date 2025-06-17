"use client"

import { ChevronDown, ChevronRight, FileText, Database, Settings, Users, FolderOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  currentUser?: {
    employeeNumber: string
    name: string
  }
  expandedMenus: {
    [key: string]: boolean
  }
  onMenuToggle: (menu: string) => void
  currentYear: number
  currentMonth: number
  currentWeek: number
  className?: string
}

export function Sidebar({ currentUser, expandedMenus, onMenuToggle, currentYear, currentMonth, currentWeek, className = "" }: SidebarProps) {
  const pathname = usePathname()
  const isFileManagementPage = pathname.startsWith("/file-management")
  const isZDataManagementPage = pathname.startsWith("/z_datamanagement")

  // サイドバーの背景色を決定する
  const getSidebarBgClass = () => {
    if (isFileManagementPage) return 'bg-gray-800'
    if (isZDataManagementPage) return 'bg-gray-800'
    return 'bg-white'
  }

  // テキストの色を決定する
  const getTextColorClass = () => {
    if (isFileManagementPage) return 'text-gray-300'
    if (isZDataManagementPage) return 'text-gray-300'
    return 'text-gray-700'
  }

  // ホバー時の背景色を決定する
  const getHoverBgClass = () => {
    if (isFileManagementPage) return 'hover:bg-gray-700'
    if (isZDataManagementPage) return 'hover:bg-gray-700'
    return 'hover:bg-gray-100'
  }

  // アクティブ時の背景色を決定する
  const getActiveBgClass = () => {
    if (isFileManagementPage) return 'bg-gray-700'
    if (isZDataManagementPage) return 'bg-gray-700'
    return 'bg-gray-100'
  }

  // アイコンの色を決定する
  const getIconColorClass = () => {
    if (isFileManagementPage) return 'text-gray-400'
    if (isZDataManagementPage) return 'text-gray-400'
    return 'text-gray-500'
  }

  // アクティブ時のアイコンの色を決定する
  const getActiveIconColorClass = () => {
    if (isFileManagementPage) return 'text-white'
    if (isZDataManagementPage) return 'text-white'
    return 'text-gray-700'
  }

  // アクティブ時のテキストの色を決定する
  const getActiveTextColorClass = () => {
    if (isFileManagementPage) return 'text-white'
    if (isZDataManagementPage) return 'text-white'
    return 'text-gray-900'
  }

  // アクティブ時のフォントの太さを決定する
  const getActiveFontWeightClass = () => {
    if (isFileManagementPage) return 'font-semibold'
    if (isZDataManagementPage) return 'font-semibold'
    return 'font-medium'
  }

  // アクティブ時のボーダーの色を決定する
  const getActiveBorderColorClass = () => {
    if (isFileManagementPage) return 'border-gray-600'
    if (isZDataManagementPage) return 'border-gray-600'
    return 'border-gray-300'
  }

  // アクティブ時のボーダーの太さを決定する
  const getActiveBorderWidthClass = () => {
    if (isFileManagementPage) return 'border-l-4'
    if (isZDataManagementPage) return 'border-l-4'
    return 'border-l-2'
  }

  // アクティブ時のパディングを決定する
  const getActivePaddingClass = () => {
    if (isFileManagementPage) return 'pl-3'
    if (isZDataManagementPage) return 'pl-3'
    return 'pl-4'
  }

  // アクティブ時のマージンを決定する
  const getActiveMarginClass = () => {
    if (isFileManagementPage) return 'ml-0'
    if (isZDataManagementPage) return 'ml-0'
    return 'ml-2'
  }

  // アクティブ時のボーダーの位置を決定する
  const getActiveBorderPositionClass = () => {
    if (isFileManagementPage) return 'border-l-4'
    if (isZDataManagementPage) return 'border-l-4'
    return 'border-l-2'
  }

  return (
    <aside className={`w-64 ${getSidebarBgClass()} ${className}`}>
      <nav className="h-full py-4">
        <ul className="space-y-2">
          {/* データ管理メニュー */}
          {isZDataManagementPage && (
            <>
              <li>
                <Link
                  href="/z_datamanagement"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/z_datamanagement" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Database className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>データ管理</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/z_datamanagement/upload"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/z_datamanagement/upload" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Database className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>データアップロード</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/z_datamanagement/download"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/z_datamanagement/download" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Database className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>データダウンロード</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/z_datamanagement/settings"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/z_datamanagement/settings" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Settings className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>設定</span>
                </Link>
              </li>
            </>
          )}

          {/* 一般メニュー */}
          {!isZDataManagementPage && (
            <>
              <li>
                <Link
                  href="/"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <FileText className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>ホーム</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/file-management"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/file-management" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <FolderOpen className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>ファイル管理</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/z_datamanagement/main/all/index"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/database_control" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Database className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>データベース管理</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                    pathname === "/settings" ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
                  }`}
                >
                  <Settings className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
                  <span>設定</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
} 