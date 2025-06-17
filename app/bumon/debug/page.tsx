"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/app/bumon/ui/textarea"
import { Label } from "@/components/ui/label"

export default function DebugPage() {
  const [dbStructure, setDbStructure] = useState<any>(null)
  const [queryResult, setQueryResult] = useState<any>(null)
  const [projectsTableInfo, setProjectsTableInfo] = useState<any>(null)
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM bumon LIMIT 10")
  const [isLoading, setIsLoading] = useState(false)
  const [isQueryLoading, setIsQueryLoading] = useState(false)
  const [isProjectsLoading, setIsProjectsLoading] = useState(false)

  const checkDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bumon/check-db")
      const data = await response.json()
      setDbStructure(data)
      toast({
        title: "データベース構造を取得しました",
        description: "データベース構造の確認が完了しました。",
      })
    } catch (error) {
      console.error("データベース構造の確認に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "データベース構造の確認中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkProjectsTable = async () => {
    setIsProjectsLoading(true)
    try {
      const response = await fetch("/api/bumon/check-projects-table")
      const data = await response.json()
      setProjectsTableInfo(data)
      toast({
        title: "プロジェクトテーブル情報を取得しました",
        description: "プロジェクトテーブルの確認が完了しました。",
      })
    } catch (error) {
      console.error("プロジェクトテーブルの確認に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "プロジェクトテーブルの確認中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsProjectsLoading(false)
    }
  }

  const executeQuery = async () => {
    setIsQueryLoading(true)
    try {
      const response = await fetch(`/api/bumon/debug-query?query=${encodeURIComponent(sqlQuery)}`)
      const data = await response.json()
      setQueryResult(data)

      if (data.success) {
        toast({
          title: "クエリを実行しました",
          description: "SQLクエリの実行が完了しました。",
        })
      } else {
        toast({
          title: "クエリの実行に失敗しました",
          description: data.error || "不明なエラーが発生しました。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("SQLクエリの実行に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "SQLクエリの実行中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsQueryLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">データベースデバッグ</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>データベース構造確認</CardTitle>
          <CardDescription>データベースのテーブル構造を確認します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={checkDatabase} disabled={isLoading}>
              {isLoading ? "確認中..." : "データベース構造を確認"}
            </Button>
            <Button onClick={checkProjectsTable} disabled={isProjectsLoading} variant="outline">
              {isProjectsLoading ? "確認中..." : "プロジェクトテーブルを確認"}
            </Button>
          </div>

          {dbStructure && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
              <pre className="text-sm">{JSON.stringify(dbStructure, null, 2)}</pre>
            </div>
          )}

          {projectsTableInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
              <h3 className="font-medium mb-2">プロジェクトテーブル情報</h3>
              <pre className="text-sm">{JSON.stringify(projectsTableInfo, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>SQLクエリ実行</CardTitle>
          <CardDescription>任意のSQLクエリを実行して結果を確認します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sql-query">SQLクエリ</Label>
              <Textarea
                id="sql-query"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                placeholder="SELECT * FROM bumon LIMIT 10"
              />
            </div>

            <Button onClick={executeQuery} disabled={isQueryLoading}>
              {isQueryLoading ? "実行中..." : "クエリを実行"}
            </Button>

            {queryResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <pre className="text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
