"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, ArrowLeftIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProjectHeader } from "@/app/project/components/project-header"

interface Project {
  id: string
  projectNumber: string
  name: string
  description: string
  status: string
  clientName: string
  startDate: string
  endDate: string
  role?: string
  joinDate?: string
}

export default function UserProjectsPage({ params }: { params: { user_id: string } }) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>("")
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  useEffect(() => {
    async function fetchUserProjects() {
      try {
        // ユーザーIDが "current" の場合、現在のログインユーザーのIDを使用
        const userId = params.user_id === "current" ? "current" : params.user_id
        
        const response = await fetch(`/api/project/person/${userId}`)
        if (!response.ok) {
          throw new Error("プロジェクトの取得に失敗しました")
        }
        
        const data = await response.json()
        setProjects(data.projects)
        setUserName(data.userName || params.user_id)
        setIsCurrentUser(data.isCurrentUser)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "エラー",
          description: "参加プロジェクトの取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProjects()
  }, [params.user_id])

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <ProjectHeader />
      <div className="w-full px-6 py-6">
        <div className="container mx-auto py-8">
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link 
                  key={project.projectNumber} 
                  href={`/project/detail/${project.projectNumber}/overview/main`}
                  className="no-underline"
                >
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <Badge>{project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.projectNumber}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4 line-clamp-2">{project.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {project.startDate} 〜 {project.endDate || "未定"}
                          </span>
                        </div>
                        {project.role && (
                          <div className="flex items-center text-muted-foreground">
                            <Badge variant="outline" className="mr-2">
                              {project.role}
                            </Badge>
                            <ClockIcon className="h-3 w-3 mr-1" />
                            <span>{project.joinDate || "不明"} から参加</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">参加プロジェクトがありません</h3>
              <p className="text-muted-foreground mb-6">
                {isCurrentUser
                  ? "まだどのプロジェクトにも参加していません。"
                  : "このユーザーはまだプロジェクトに参加していません。"}
              </p>
              <Link href="/project/projectlist/all">
                <Button>プロジェクト一覧を見る</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 