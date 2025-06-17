"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnSelector } from "@/app/project/components/column-selector"
import type { Project, ColumnVisibility, SortConfig } from "@/lib/project/types"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { ProjectHeader } from "@/app/project/components/project-header"

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/project/list")
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <ProjectHeader />
      <div className="w-full px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">全プロジェクト一覧</h1>
            </div>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
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
          </div>

          <div className="flex-1 overflow-hidden p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : sortedProjects.length > 0 ? (
              <div className="rounded-md border overflow-hidden h-full">
                <div className="overflow-x-auto h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {allColumns.map(
                          (column) =>
                            visibleColumns[column.key] && (
                              <TableHead
                                key={column.key}
                                className="cursor-pointer hover:bg-muted/50 bg-gray-100"
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
                        <TableHead className="bg-gray-100">詳細</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProjects.map((project) => (
                        <TableRow key={project.projectNumber} className="hover:bg-gray-50">
                          {allColumns.map(
                            (column) =>
                              visibleColumns[column.key] && (
                                <TableCell key={column.key}>{project[column.key as keyof Project]}</TableCell>
                              ),
                          )}
                          <TableCell>
                            <Link href={`/project/detail/${project.projectNumber}/overview/main`}>
                              <Button variant="ghost" size="sm">
                                詳細
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border">
                <div className="text-center py-8 text-gray-500">
                  プロジェクトが見つかりません
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
