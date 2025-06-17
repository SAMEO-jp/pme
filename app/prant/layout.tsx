"use client"

import Link from "next/link"
import { Factory, Building, Flame, Scissors, Layers, User, LogIn, Settings } from "lucide-react"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function PrantLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const isBlastFurnace = pathname.startsWith("/prant/blast-furnace");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* ヘッダー部分 */}
      <header className="border-b p-0 bg-white dark:bg-slate-800 shadow-sm">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold hover:text-gray-600 transition-colors p-4">
              PMEデータHUB
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center">
              <div className="bg-red-600 p-3 rounded-xl text-white mr-4">
                <Factory className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600 dark:from-red-400 dark:to-orange-500">
                {isBlastFurnace ? "高炉" : "設備管理システム"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <div className="flex items-center mr-2">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium">仮ログイン</span>
              <button
                className="ml-2 p-1 rounded-full hover:bg-gray-100"
                title="ユーザー切替"
              >
                <LogIn className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー部分 */}
        <aside className="w-64 border-r h-[calc(100vh-64px)] p-4 bg-gray-50 dark:bg-slate-900">
          <h3 className="font-medium mb-4 dark:text-white">設備メニュー</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/prant" 
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname === "/prant" ? "text-blue-600" : ""
                }`}
              >
                <Factory className="h-4 w-4 mr-2" />
                <span>設備一覧</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prant/blast-furnace" 
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname.includes("/blast-furnace") ? "text-blue-600" : ""
                }`}
              >
                <Factory className="h-4 w-4 mr-2" />
                <span>高炉</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prant/steelmaking"
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname.includes("/steelmaking") ? "text-blue-600" : ""
                }`}
              >
                <Building className="h-4 w-4 mr-2" />
                <span>製鋼</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prant/cdq"
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname.includes("/cdq") ? "text-blue-600" : ""
                }`}
              >
                <Flame className="h-4 w-4 mr-2" />
                <span>CDQ</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prant/rolling"
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname.includes("/rolling") ? "text-blue-600" : ""
                }`}
              >
                <Scissors className="h-4 w-4 mr-2" />
                <span>圧延</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prant/continuous-casting"
                className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded cursor-pointer ${
                  pathname.includes("/continuous-casting") ? "text-blue-600" : ""
                }`}
              >
                <Layers className="h-4 w-4 mr-2" />
                <span>連鋳</span>
              </Link>
            </li>
          </ul>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 px-0.1">
          {children}
        </main>
      </div>
    </div>
  )
} 