"use client"

import { ReactNode, useState, useEffect } from "react"
import { Header } from "./layouts/Header/index"
import { Sidebar } from "./layouts/Sidebar/index"
import { MainTabHeader } from "./layouts/MainTabHeader/index"
import { SubTabHeader } from "./layouts/SubTabHeader/index"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

interface RootLayoutProps {
  children: ReactNode
}

interface AllUser {
  user_id: string;
  name_japanese: string;
  TEL: string;
  mail: string;
  name_english: string;
  name_yomi: string;
  company: string;
  bumon: string;
  in_year: string;
  Kengen: string;
  TEL_naisen: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<AllUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // まずlocalStorageからユーザー情報を確認
        const userData = localStorage.getItem('currentUser')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          // 仮ログインでない場合のみ設定
          if (parsedUser.user_id !== "999999") {
            setCurrentUser(parsedUser)
            setIsLoading(false)
            return
          }
        }

        // localStorageにデータがない場合、または仮ログインの場合はAPIから取得
        const response = await fetch("/api/user")
        const data = await response.json()
        
        if (data.success && data.data) {
          const user = {
            user_id: data.data.user_id || data.data.employeeNumber,
            name_japanese: data.data.name || "未設定",
            // その他の必要なフィールドを設定
            TEL: data.data.TEL || "",
            mail: data.data.mail || "",
            name_english: data.data.name_english || "",
            name_yomi: data.data.name_yomi || "",
            company: data.data.company || "",
            bumon: data.data.bumon || "",
            in_year: data.data.in_year || "",
            Kengen: data.data.Kengen || "",
            TEL_naisen: data.data.TEL_naisen || "",
            sitsu: data.data.sitsu || "",
            ka: data.data.ka || "",
            syokui: data.data.syokui || ""
          }
          
          // ユーザー情報をlocalStorageに保存
          localStorage.setItem('currentUser', JSON.stringify(user))
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  // 現在の日付情報を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentWeek = Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)

  // サブタブの設定
  const subTabs = [
    { name: "概要", href: "/dashboard" },
    { name: "プロジェクト", href: "/dashboard/projects" },
    { name: "タスク", href: "/dashboard/tasks" },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        currentUser={{
          employeeNumber: currentUser?.user_id || "999999",
          name: currentUser?.name_japanese || "仮 ユーザー"
        }}
        onLoginClick={() => {}}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentYear={currentYear}
          currentMonth={currentMonth}
          currentWeek={currentWeek}
          expandedMenus={{}}
          onMenuToggle={() => {}}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MainTabHeader currentTab={pathname} />
          <SubTabHeader tabs={subTabs} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
} 