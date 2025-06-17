"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AddProjectMemberForm } from "./add-project-member-form"

interface ProjectMember {
  id: number
  member_id: number
  project_id: string
  joined_at: string
  left_at: string | null
  role: string
  member_name?: string
  department_name?: string
}

interface ProjectMemberListProps {
  projectId: string
}

export function ProjectMemberList({ projectId }: ProjectMemberListProps) {
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  // プロジェクトメンバー一覧を取得
  const fetchMembers = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/project/members/${projectId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }

      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
      toast({
        title: "エラー",
        description: "メンバー情報の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchMembers()
    }
  }, [projectId])

  // 手動更新ボタン
  const handleRefresh = () => {
    fetchMembers()
  }

  // メンバー追加モーダルを開く
  const openAddMemberModal = () => {
    setIsAddMemberOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>プロジェクトメンバー</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="default" size="sm" onClick={openAddMemberModal}>
            <UserPlus className="h-4 w-4 mr-2" />
            メンバー追加
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">読み込み中...</div>
        ) : members.length > 0 ? (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">
                    {member.member_name || `メンバーID: ${member.member_id}`}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline">{member.role}</Badge>
                    {member.department_name && <Badge variant="secondary">{member.department_name}</Badge>}
                    <span>参加日: {member.joined_at}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground">メンバーはまだいません</div>
        )}
      </CardContent>

      <AddProjectMemberForm
        projectId={projectId}
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onSuccess={fetchMembers}
      />
    </Card>
  )
} 