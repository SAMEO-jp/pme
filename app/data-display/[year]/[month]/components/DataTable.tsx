"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Download, Filter } from "lucide-react"

export interface Column {
  id: string;
  name: string;
  checked: boolean;
  category?: string;
}

type DataTableProps = {
  data: any[]
  columns: Column[]
  setColumns: (columns: Column[]) => void
  sortField: string | null
  setSortField: (field: string | null) => void
  sortDirection: "asc" | "desc"
  setSortDirection: (direction: "asc" | "desc") => void
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
}

export default function DataTable({ 
  data, 
  columns, 
  setColumns,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  filters,
  setFilters
}: DataTableProps) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<string | null>(null)
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
  const [columnSearchTerm, setColumnSearchTerm] = useState("")

  // 表示する列のみをフィルタリング
  const visibleColumns = columns.filter((col) => col.checked)

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

  // ソートの切り替え
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // フィルターの適用
  const applyFilter = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    setIsFilterMenuOpen(null);
  }

  // フィルターのクリア
  const clearFilter = (field: string) => {
    const newFilters = { ...filters };
    delete newFilters[field];
    setFilters(newFilters);
    setIsFilterMenuOpen(null);
  }

  // 列の表示/非表示を切り替える
  const toggleColumn = (columnId: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, checked: !col.checked } : col)))
  }

  // CSVダウンロード
  const downloadCSV = () => {
    // 表示されている列と行のみを対象にする
    const processedData = filterData(sortData(data))
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

  // データの処理
  const processedData = filterData(sortData(data))

  const filterColumns = (columns: Column[], category: string) => {
    return columns.filter((col) => col.category === category);
  }

  return (
    <div className="space-y-2">
      {/* CSVダウンロードセクション */}
      <div className="flex justify-end items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadCSV}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-4 w-4 mr-1.5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            CSV出力
          </button>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="columns-menu"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
              >
                <svg
                  className="h-4 w-4 mr-1.5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                表示列
              </button>
            </div>
            {isColumnSelectorOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="columns-menu"
              >
                <div className="py-1 max-h-96 overflow-y-auto" role="none">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`column-${column.id}`}
                        checked={column.checked}
                        onChange={() => toggleColumn(column.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`column-${column.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        {column.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* テーブルセクション */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-auto h-[calc(100vh-170px)]">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                {columns
                  .filter((column) => column.checked)
                  .map((column, index, array) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer whitespace-nowrap ${index < array.length - 1 ? 'border-r border-gray-300' : ''}`}
                      onClick={() => toggleSort(column.id)}
                    >
                      <div className="flex items-center">
                        {column.name}
                        {sortField === column.id && (
                          <span className="ml-1 text-blue-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {processedData.map((row, rowIndex) => (
                <tr
                  key={row.keyID || rowIndex}
                  className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                >
                  {columns
                    .filter((column) => column.checked)
                    .map((column, index, array) => (
                      <td
                        key={`${row.keyID || rowIndex}-${column.id}`}
                        className={`px-6 py-3 whitespace-nowrap text-sm text-gray-900 
                        ${column.id === "employeeNumber" ? "w-24" : ""} 
                        ${column.id === "startDateTime" || column.id === "endDateTime" ? "w-40" : ""} 
                        ${column.id === "subject" ? "min-w-[200px]" : ""}
                        ${column.id === "projectNumber" ? "w-36" : ""}
                        ${column.id === "type" || column.id === "status" ? "w-24" : ""}
                        ${index < array.length - 1 ? 'border-r border-gray-300' : ''}`}
                      >
                        {column.id === "status" ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              row[column.id] === "完了"
                                ? "bg-green-100 text-green-800"
                                : row[column.id] === "進行中"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : row[column.id] === "計画中"
                                    ? "bg-blue-100 text-blue-800"
                                    : row[column.id] === "中止"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {row[column.id]}
                          </span>
                        ) : column.id === "startDateTime" ||
                          column.id === "endDateTime" ||
                          column.id === "createdAt" ||
                          column.id === "updatedAt" ? (
                          // 日時フォーマット
                          row[column.id] ? (
                            new Date(row[column.id]).toLocaleString("ja-JP")
                          ) : (
                            ""
                          )
                        ) : column.id === "businessCode" ||
                          column.id === "departmentCode" ||
                          column.id.startsWith("classification") ? (
                          // コードフィールドは等幅フォントで表示
                          <span className="font-mono">{row[column.id]}</span>
                        ) : column.id === "content" ? (
                          // 内容は最大3行まで表示
                          <div className="max-h-16 overflow-hidden text-sm">{row[column.id]}</div>
                        ) : (
                          row[column.id]
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
