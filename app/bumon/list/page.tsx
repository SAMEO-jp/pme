"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/bumon/ui/table"
import { Edit, Trash2, Plus, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import type { Department } from "@/lib/bumon/types"

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/bumon")

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.departments) {
          setDepartments(data.departments)
        }
      } catch (error) {
        console.error("部門情報の取得に失敗しました:", error)
        toast({
          title: "エラーが発生しました",
          description: "部門情報の取得中にエラーが発生しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("この部門を削除してもよろしいですか？")) {
      return
    }

    try {
      const response = await fetch(`/api/bumon/${id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // 成功したら部門リストから削除
      setDepartments(departments.filter((dept) => dept.bumon_id !== id))

      toast({
        title: "部門が削除されました",
        description: "部門の削除が完了しました。",
      })
    } catch (error) {
      console.error("部門の削除に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "部門の削除中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">部門一覧</h1>
        <Link href="/bumon/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規部門作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>部門情報</CardTitle>
          <CardDescription>登録されている部門の一覧です。編集や削除ができます。</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2">データを読み込み中...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部門コード</TableHead>
                    <TableHead>部門名</TableHead>
                    <TableHead>部門責任者</TableHead>
                    <TableHead>開始日</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        部門データがありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow key={department.bumon_id}>
                        <TableCell>{department.bumon_id}</TableCell>
                        <TableCell>
                          <Link
                            href={`/bumon/detail/${department.bumon_id}`}
                            className="text-blue-600 hover:underline hover:text-blue-800 flex items-center"
                          >
                            {department.name}
                            <FileText className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>{department.leader}</TableCell>
                        <TableCell>{department.startday}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/bumon/edit/${department.bumon_id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">編集</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(department.bumon_id)}>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
