"use client"

import { User, LogIn, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  currentUser: {
    employeeNumber: string
    name: string
  }
  headerProject: {
    name: string
    projectNumber: string
  }
  onLoginClick: () => void
  className?: string
}

export function Header({ currentUser, headerProject, onLoginClick, className = "" }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className={`border-b bg-gradient-to-r from-red-600 to-red-500 text-white ${className}`}>
      <div className="w-full px-0 py-4 grid grid-cols-[auto,1fr,auto]">
        <div className="pl-6">
          <Link href="/" className="text-2xl font-bold transition-colors text-white hover:text-gray-100">
            PMEデータHUB
          </Link>
        </div>
        
        {/* ヘッダー中央にプロジェクト名・番号を表示 */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">
              {headerProject.name} 
            </span>
            <span className="text-xl ml-2 text-gray-100">
              ({headerProject.projectNumber})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pr-6">
          {/* ユーザー情報表示 */}
          <div className="flex items-center rounded-full py-1 px-3 bg-white/10 text-white">
            <User className="h-5 w-5 mr-2 text-white" />
            <span className="text-sm font-medium">{currentUser.name}</span>
            <button
              onClick={onLoginClick}
              className="ml-2 p-1 rounded-full hover:bg-white/20"
              title="ユーザー切替"
            >
              <LogIn className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <button className="p-2 rounded-full hover:bg-white/20 text-white">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
} 