"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"
import DataTable from "./components/DataTable"
import ChartView from "./components/ChartView"
import { ViewModeContext } from "@/app/(main)/contexts/ViewModeContext"
import AttendanceView from "./components/AttendanceView"

export default function DataDisplayPage() {
  // useParamsフックを使用してパラメータを取得
  const params = useParams()

  // URLパラメータから年と月を取得
  const year = Number.parseInt(params.year as string) || new Date().getFullYear()
  const month = Number.parseInt(params.month as string) || new Date().getMonth() + 1

  // 月の名前を取得
  const monthName = new Date(year, month - 1, 1).toLocaleString("ja-JP", { month: "long" })

  // ビューモードコンテキストを使用
  const { viewMode, setViewMode } = useContext(ViewModeContext)

  // ログインユーザーの状態
  const [currentUser, setCurrentUser] = useState<{ user_id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ログインユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()
        console.log("User data:", data) // デバッグ用
        if (data.success && data.data) {
          setCurrentUser(data.data)
        } else {
          setError("ユーザー情報の取得に失敗しました")
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
        setError("ユーザー情報の取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // 列の定義
  const allColumns = [
    // 主要フィールド（デフォルトで表示）
    { id: "keyID", name: "ID", checked: false },
    { id: "employeeNumber", name: "社員番号", checked: true },
    { id: "startDateTime", name: "開始日時", checked: true },
    { id: "endDateTime", name: "終了日時", checked: true },
    { id: "subject", name: "件名", checked: true },
    { id: "content", name: "内容", checked: false },
    { id: "type", name: "種類", checked: true },
    { id: "organizer", name: "開催者名", checked: false },
    { id: "projectNumber", name: "プロジェクト番号", checked: true },
    { id: "position", name: "立場", checked: false },
    { id: "facility", name: "設備", checked: false },
    { id: "status", name: "状態", checked: true },

    // コード関連フィールド
    { id: "businessCode", name: "業務コード", checked: true },
    { id: "departmentCode", name: "設備番号", checked: true },
    { id: "weekCode", name: "週コード", checked: false },

    // 分類フィールド
    { id: "classification1", name: "分類1", checked: false },
    { id: "classification2", name: "分類2", checked: false },
    { id: "classification3", name: "分類3", checked: false },
    { id: "classification4", name: "分類4", checked: false },
    { id: "classification5", name: "分類5 (旧業務コード)", checked: false },
    { id: "classification6", name: "分類6", checked: false },
    { id: "classification7", name: "分類7", checked: false },
    { id: "classification8", name: "分類8", checked: false },
    { id: "classification9", name: "分類9", checked: false },

    // システムフィールド
    { id: "createdAt", name: "作成日時", checked: false },
    { id: "updatedAt", name: "更新日時", checked: false },
  ]

  // 状態管理
  const [columns, setColumns] = useState(allColumns)
  const [achievements, setAchievements] = useState([])
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, string>>({})

  // データベースからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.user_id) {
        console.log("No user_id available") // デバッグ用
        return
      }

      setLoading(true)
      try {
        console.log("Fetching data for user:", currentUser.user_id) // デバッグ用
        const response = await fetch(`/api/achievements/month/${year}/${month}?employeeNumber=${currentUser.user_id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        if (data.success) {
          setAchievements(data.data)
        } else {
          throw new Error(data.message || "データの取得に失敗しました")
        }
      } catch (error: unknown) {
        console.error("データの取得中にエラーが発生しました:", error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("不明なエラーが発生しました")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, month, currentUser])

  // ソート関数
  const sortData = (data: any[]) => {
    if (!sortField) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      // null や undefined の場合は最後に表示
      if (aValue === null || aValue === undefined) return sortDirection === "asc" ? 1 : -1
      if (bValue === null || bValue === undefined) return sortDirection === "asc" ? -1 : 1

      // 数値の場合は数値としてソート
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      }

      // 文字列の場合は文字列としてソート
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }

  // フィルタリング関数
  const filterData = (data: any[]) => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const cellValue = String(row[key] || "").toLowerCase()
        return cellValue.includes(value.toLowerCase())
      })
    })
  }

  // CSVダウンロード
  const downloadCSV = () => {
    // 表示されている列と行のみを対象にする
    const visibleColumns = columns.filter((col) => col.checked)
    const processedData = filterData(sortData(achievements))
    const headers = visibleColumns.map((col) => col.name).join(",")

    const rows = processedData.map((row) => {
      return visibleColumns
        .map((col) => {
          // カンマを含む場合はダブルクォートで囲む
          const value = row[col.id] !== undefined && row[col.id] !== null ? row[col.id] : ""
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(",")
    })

    const csv = [headers, ...rows].join("\n")

    // BOMを追加してUTF-8として認識されるようにする
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `data_export_${new Date().toISOString().slice(0, 10)}.csv`)
    a.click()

    URL.revokeObjectURL(url)
  }

  // ViewModeContextを更新（余計な更新を防ぐためにuseEffect外で行う）
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('updateHeaderData', {
      detail: { columns, setColumns, downloadCSV }
    }))
  }, [columns])

  return (
    <div className="p-4 h-full">
      <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
        <div className="flex-1 overflow-hidden p-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">エラーが発生しました: {error}</div>
          ) : !currentUser ? (
            <div className="text-center py-8 text-red-500">ログインが必要です</div>
          ) : achievements.length > 0 ? (
            viewMode === "table" ? (
              <DataTable 
                data={achievements} 
                columns={columns} 
                setColumns={setColumns}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                filters={filters}
                setFilters={setFilters}
              />
            ) : viewMode === "calendar" ? (
              <AttendanceView year={year} month={month} />
            ) : viewMode === "chart" ? (
              <ChartView year={year} month={month} />
            ) : (
              <div className="text-center py-8 text-gray-500">不明な表示モードです</div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              {year}年{monthName}のデータはありません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
