"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/bumon/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Project } from "@/lib/bumon/types"

interface ProjectListProps {
  bumon_id: string
}

export function ProjectList({ bumon_id }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        console.log(`Fetching projects for department: ${bumon_id}`)

        const response = await fetch(`/api/bumon/projects?departmentCode=${bumon_id}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log(`Received projects data:`, data)

        setProjects(data.projects || [])
      } catch (error) {
        console.error("プロジェクト情報の取得に失敗しました:", error)
        toast({
          title: "エラーが発生しました",
          description: "プロジェクト情報の取得中にエラーが発生しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [bumon_id])

  const handleDelete = async (projectNumber: string) => {
    if (!confirm("このプロジェクトを削除してもよろしいですか？")) {
      return
    }

    try {
      const response = await fetch(`/api/bumon/projects/${projectNumber}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // 成功したらプロジェクトリストから削除
      setProjects(projects.filter((project) => project.projectNumber !== projectNumber))

      toast({
        title: "プロジェクトが削除されました",
        description: "プロジェクトの削除が完了しました。",
      })
    } catch (error) {
      console.error("プロジェクトの削除に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "プロジェクトの削除中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">プロジェクトデータを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">プロジェクト一覧</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          新規プロジェクト
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>プロジェクト番号</TableHead>
              <TableHead>プロジェクト名</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>開始日</TableHead>
              <TableHead>終了日</TableHead>
              <TableHead>顧客名</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  プロジェクトデータがありません
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.projectNumber}>
                  <TableCell>{project.projectNumber}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate || "-"}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/bumon/projects/${project.projectNumber}`}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">詳細</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/bumon/projects/edit/${project.projectNumber}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">編集</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(project.projectNumber)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
