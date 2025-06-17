"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnSelector } from "@/app/project/components/column-selector"
import type { Project, ColumnVisibility, SortConfig } from "@/lib/project/types"
import { ChevronDown, ChevronUp, Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DepartmentProjects({ params }: { params: { department: string } }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "projectNumber", direction: "desc" })

  // Define all available columns
  const allColumns = [
    { key: "projectNumber", label: "プロジェクト番号" },
    { key: "name", label: "プロジェクト名" },
    { key: "clientName", label: "客先" },
    { key: "equipmentCategory", label: "大設備" },
    { key: "spare1", label: "プロマネ" }, // Assuming spare1 is used for project manager
    { key: "startDate", label: "開始日" },
    { key: "endDate", label: "終了日" },
    { key: "budgetGrade", label: "金額レベル" },
    { key: "notes", label: "コメント" },
    { key: "status", label: "ステータス" },
    { key: "description", label: "説明" },
    { key: "classification", label: "分類" },
    { key: "equipmentNumbers", label: "設備番号" },
    { key: "projectStartDate", label: "プロジェクト開始日" },
    { key: "projectEndDate", label: "プロジェクト終了日" },
    { key: "installationDate", label: "設置日" },
    { key: "drawingCompletionDate", label: "図面完成日" },
  ]

  // Default visible columns
  const defaultVisibleColumns: ColumnVisibility = {
    projectNumber: true,
    name: true,
    clientName: true,
    equipmentCategory: true,
    spare1: true, // Project manager
    startDate: true,
    endDate: true,
    budgetGrade: true,
    notes: true,
    status: false,
    description: false,
    classification: false,
    equipmentNumbers: false,
    projectStartDate: false,
    projectEndDate: false,
    installationDate: false,
    drawingCompletionDate: false,
  }

  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(defaultVisibleColumns)
  const department = decodeURIComponent(params.department)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)
        console.log("Frontend: Fetching projects for department:", department)

        const response = await fetch(`/api/project/list?department=${encodeURIComponent(department)}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Frontend: Received projects:", data)

        if (Array.isArray(data)) {
          setProjects(data)
          if (data.length === 0) {
            setError(`「${department}」部門のプロジェクトが見つかりませんでした。部門名が正しいか確認してください。`)
          }
        } else {
          console.error("Unexpected data format:", data)
          setError("データの形式が不正です")
          setProjects([])
        }
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "プロジェクトの取得に失敗しました")
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [department])

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
  }

  // Sort and filter projects
  const sortedProjects = [...projects]
    .filter((project) => {
      if (!searchTerm) return true

      // Search in all text fields
      return Object.values(project).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Project]
      const bValue = b[sortConfig.key as keyof Project]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{department}部門のプロジェクト</h1>
        <div className="flex gap-2">
          <Link href="/project/projectlist/all">
            <Button variant="outline">全プロジェクト</Button>
          </Link>
          <Link href="/project/home">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="プロジェクトを検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ColumnSelector columns={allColumns} visibleColumns={visibleColumns} onColumnChange={setVisibleColumns} />
      </div>

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {allColumns.map(
                    (column) =>
                      visibleColumns[column.key] && (
                        <TableHead
                          key={column.key}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort(column.key)}
                        >
                          <div className="flex items-center">
                            {column.label}
                            {sortConfig.key === column.key &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                      ),
                  )}
                  <TableHead>詳細</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((project) => (
                    <TableRow key={project.projectNumber}>
                      {allColumns.map(
                        (column) =>
                          visibleColumns[column.key] && (
                            <TableCell key={column.key}>{project[column.key as keyof Project]}</TableCell>
                          ),
                      )}
                      <TableCell>
                        <Link href={`/project/detail/${project.projectNumber}`}>
                          <Button variant="ghost" size="sm">
                            詳細
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}
                      className="text-center py-8"
                    >
                      プロジェクトが見つかりません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
