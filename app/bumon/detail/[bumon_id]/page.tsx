"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/bumon/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Building, Users, FileText } from "lucide-react"
import Link from "next/link"
import { DepartmentInfo } from "@/app/bumon/components/department-info"
import { ProjectList } from "@/app/bumon/components/project-list"
import { MemberList } from "@/app/bumon/components/member-list"
import { DepartmentMembership } from "@/app/bumon/components/department-membership"
import type { Department } from "@/lib/bumon/types"

export default function DepartmentDetailPage(props: { params: { bumon_id: string } }) {
  const router = useRouter()
  const [department, setDepartment] = useState<Department | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  
  // params.bumon_idを安全に取得
  const bumonId = props.params.bumon_id

  useEffect(() => {
    async function fetchDepartment() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/bumon/${bumonId}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.department) {
          setDepartment(data.department)
        } else {
          toast({
            title: "部門が見つかりません",
            description: "指定された部門IDは存在しません。",
            variant: "destructive",
          })
          router.push("/bumon/list")
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

    fetchDepartment()
  }, [bumonId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p>部門情報が見つかりませんでした。</p>
              <Button className="mt-4" onClick={() => router.push("/bumon/list")}>
                部門一覧に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/bumon/list" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{department.name} 詳細</h1>
      </div>

      {/* 部門参加/退出ボタン */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <DepartmentMembership departmentCode={bumonId} departmentName={department.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            部門詳細情報
          </CardTitle>
          <CardDescription>部門の詳細情報、プロジェクト、メンバーを確認できます。</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                基本情報
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                プロジェクト
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                メンバー
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <DepartmentInfo department={department} />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectList bumon_id={bumonId} />
            </TabsContent>

            <TabsContent value="members">
              <MemberList bumon_id={bumonId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
