"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import Link from "next/link"

// 週番号を取得する関数
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 現在のパスを取得
  const pathname = usePathname()

  // 現在の年月を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentWeek = getWeekNumber(currentDate)

  // ユーザー情報の状態
  const [currentUser, setCurrentUser] = useState({ employeeNumber: "999999", name: "仮ログイン" })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [employees, setEmployees] = useState<Array<{employeeNumber: string, name: string}>>([])

  // サイドバーの状態
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    management: true,
    projects: false,
    other: false,
    settings: false,
  })

  // プロジェクト詳細ページ用の状態
  const [headerProject, setHeaderProject] = useState<{ name: string; projectNumber: string } | null>(null);

  // メニューの展開/折りたたみを切り替える
  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

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

    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees")
        const data = await response.json()
        if (data.success) {
          setEmployees(data.data)
        }
      } catch (error) {
        console.error("従業員情報の取得に失敗しました:", error)
      }
    }

    fetchCurrentUser()
    fetchEmployees()
  }, [])

  useEffect(() => {
    // パスが /project/detail/ で始まる場合のみAPIでプロジェクト情報を取得
    if (pathname.startsWith("/project/detail/")) {
      const projectcode = pathname.split("/project/detail/")[1]?.split("/")[0];
      if (projectcode) {
        fetch(`/api/project/detail/${projectcode}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.name && data.projectNumber) {
              setHeaderProject({ name: data.name, projectNumber: data.projectNumber });
            } else {
              setHeaderProject(null);
            }
          })
          .catch(() => setHeaderProject(null));
      }
    } else {
      setHeaderProject(null);
    }
  }, [pathname]);

  // ログイン処理
  const handleLogin = async () => {
    if (!selectedUserId) return

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      })

      const data = await response.json()
      if (data.success) {
        setCurrentUser(data.data)
        setShowLoginModal(false)
        alert(`${data.data.name}としてログインしました`)
      } else {
        alert(`ログインに失敗しました: ${data.message}`)
      }
    } catch (error) {
      console.error("ログイン処理に失敗しました:", error)
      alert("ログイン処理に失敗しました")
    }
  }

  if (!headerProject) {
    return <div>プロジェクト情報を読み込み中...</div>
  }

  return (
    <body>
      <Header
        currentUser={currentUser}
        headerProject={headerProject}
        onLoginClick={() => setShowLoginModal(true)}
      />
      <div className="flex">
        <Sidebar
          currentUser={currentUser}
          expandedMenus={expandedMenus}
          onMenuToggle={toggleMenu}
        />
        <main className="flex-1">{children}</main>
      </div>

      {/* ログインモーダル */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">ユーザー切替</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ユーザーを選択</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">選択してください</option>
                {employees.map((employee) => (
                  <option key={employee.employeeNumber} value={employee.employeeNumber}>
                    {employee.employeeNumber} - {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={!selectedUserId}
              >
                ログイン
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </body>
  )
} 