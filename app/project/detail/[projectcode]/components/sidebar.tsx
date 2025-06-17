"use client"

import { FileText, Settings, FileEdit, FileCode, FileBarChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  currentUser: {
    employeeNumber: string
    name: string
  }
  expandedMenus: {
    [key: string]: boolean
  }
  onMenuToggle: (menu: string) => void
  className?: string
}

export function Sidebar({ currentUser, expandedMenus, onMenuToggle, className = "" }: SidebarProps) {
  const pathname = usePathname()

  // サイドバーの背景色を決定する
  const getSidebarBgClass = () => {
    return 'bg-gray-800'
  }

  // テキストの色を決定する
  const getTextColorClass = () => {
    return 'text-gray-300'
  }

  // ホバー時の背景色を決定する
  const getHoverBgClass = () => {
    return 'hover:bg-gray-700'
  }

  // アクティブ時の背景色を決定する
  const getActiveBgClass = () => {
    return 'bg-gray-700'
  }

  // アイコンの色を決定する
  const getIconColorClass = () => {
    return 'text-gray-400'
  }

  // アクティブ時のアイコンの色を決定する
  const getActiveIconColorClass = () => {
    return 'text-white'
  }

  // アクティブ時のテキストの色を決定する
  const getActiveTextColorClass = () => {
    return 'text-white'
  }

  // アクティブ時のフォントの太さを決定する
  const getActiveFontWeightClass = () => {
    return 'font-semibold'
  }

  // アクティブ時のボーダーの色を決定する
  const getActiveBorderColorClass = () => {
    return 'border-gray-600'
  }

  // アクティブ時のボーダーの太さを決定する
  const getActiveBorderWidthClass = () => {
    return 'border-l-4'
  }

  // アクティブ時のパディングを決定する
  const getActivePaddingClass = () => {
    return 'pl-3'
  }

  // アクティブ時のマージンを決定する
  const getActiveMarginClass = () => {
    return 'ml-0'
  }

  // アクティブ時のボーダーの位置を決定する
  const getActiveBorderPositionClass = () => {
    return 'border-l-4'
  }

  return (
    <aside className={`w-64 ${getSidebarBgClass()} ${className}`}>
      <nav className="h-full py-4">
        <ul className="space-y-2">
          {/* プロジェクト管理メニュー */}
          <li>
            <Link
              href={`/project/detail/${pathname.split('/')[3]}`}
              className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                pathname === `/project/detail/${pathname.split('/')[3]}` ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
              }`}
            >
              <FileText className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
              <span>プロジェクト概要</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/project/detail/${pathname.split('/')[3]}/manage`}
              className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                pathname.startsWith(`/project/detail/${pathname.split('/')[3]}/manage`) ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
              }`}
            >
              <FileEdit className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
              <span>プロジェクト管理</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/project/detail/${pathname.split('/')[3]}/design`}
              className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                pathname.startsWith(`/project/detail/${pathname.split('/')[3]}/design`) ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
              }`}
            >
              <FileCode className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
              <span>設計管理</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/project/detail/${pathname.split('/')[3]}/indirect`}
              className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                pathname.startsWith(`/project/detail/${pathname.split('/')[3]}/indirect`) ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
              }`}
            >
              <FileBarChart className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
              <span>間接管理</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/project/detail/${pathname.split('/')[3]}/settings`}
              className={`flex items-center px-4 py-2 ${getTextColorClass()} ${getHoverBgClass()} ${
                pathname === `/project/detail/${pathname.split('/')[3]}/settings` ? `${getActiveBgClass()} ${getActiveTextColorClass()} ${getActiveFontWeightClass()} ${getActiveBorderColorClass()} ${getActiveBorderWidthClass()} ${getActivePaddingClass()} ${getActiveMarginClass()} ${getActiveBorderPositionClass()}` : ""
              }`}
            >
              <Settings className={`h-5 w-5 mr-3 ${getIconColorClass()}`} />
              <span>設定</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
} 