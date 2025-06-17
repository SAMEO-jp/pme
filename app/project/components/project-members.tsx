"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, UserCheck, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AddOtherMemberButton } from "./add-other-member-button"

interface ProjectMember {
  id: number
  user_id: string | number
  project_id: string
  start_date: string
  end_date: string | null
  role: string
  user_name: string
  department_name?: string
  department_role?: string
}

interface ProjectMembersProps {
  projectId: string
}

export function ProjectMembers({ projectId }: ProjectMembersProps) {
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch project members
  const fetchMembers = async () => {
    try {
      setRefreshing(true)
      setError(null)
      console.log("Fetching members for project:", projectId)
      
      const response = await fetch(`/api/project/members/${projectId}`)

      if (!response.ok) {
        console.error("Failed to fetch members:", response.status, response.statusText)
        throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetched members data:", data)
      
      // データの検証
      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data)
        throw new Error("API did not return an array")
      }
      
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
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

  // Check if current user is a member
  const checkMemberStatus = async () => {
    try {
      console.log("Checking member status for project:", projectId)
      const response = await fetch(`/api/project/members/status?projectId=${projectId}`)

      if (!response.ok) {
        console.error("Failed to check member status:", response.status, response.statusText)
        throw new Error("Failed to check member status")
      }

      const data = await response.json()
      console.log("Member status:", data)
      setIsMember(data.isMember)
    } catch (error) {
      console.error("Error checking member status:", error)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchMembers()
      checkMemberStatus()
    }
  }, [projectId])

  // Join project
  const handleJoin = async () => {
    setJoining(true)
    try {
      console.log("Joining project:", projectId)
      const response = await fetch("/api/project/members/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, role: "メンバー" }),
      })

      if (!response.ok) {
        console.error("Failed to join project:", response.status, response.statusText)
        throw new Error("Failed to join project")
      }

      const result = await response.json()
      console.log("Join result:", result)

      toast({
        title: "参加しました",
        description: "プロジェクトに参加しました",
      })

      setIsMember(true)

      // 少し遅延を入れてからメンバーリストを更新
      setTimeout(() => {
        fetchMembers()
      }, 500)
    } catch (error) {
      console.error("Error joining project:", error)
      toast({
        title: "エラー",
        description: "プロジェクトへの参加に失敗しました",
        variant: "destructive",
      })
    } finally {
      setJoining(false)
    }
  }

  // Leave project
  const handleLeave = async () => {
    setLeaving(true)
    try {
      console.log("Leaving project:", projectId)
      const response = await fetch("/api/project/members/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        console.error("Failed to leave project:", response.status, response.statusText)
        throw new Error("Failed to leave project")
      }

      const result = await response.json()
      console.log("Leave result:", result)

      toast({
        title: "退会しました",
        description: "プロジェクトから退会しました",
      })

      setIsMember(false)

      // 少し遅延を入れてからメンバーリストを更新
      setTimeout(() => {
        fetchMembers()
      }, 500)
    } catch (error) {
      console.error("Error leaving project:", error)
      toast({
        title: "エラー",
        description: "プロジェクトからの退会に失敗しました",
        variant: "destructive",
      })
    } finally {
      setLeaving(false)
    }
  }

  // 手動更新ボタン
  const handleRefresh = () => {
    fetchMembers()
    checkMemberStatus()
  }

  // デバッグ情報の表示
  console.log("Current members state:", members)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>プロジェクトメンバー</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          {isMember ? (
            <Button variant="outline" size="sm" onClick={handleLeave} disabled={leaving}>
              {leaving ? (
                "処理中..."
              ) : (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  退会する
                </>
              )}
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleJoin} disabled={joining}>
              {joining ? (
                "処理中..."
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  参加する
                </>
              )}
            </Button>
          )}
          <AddOtherMemberButton projectId={projectId} onSuccess={fetchMembers} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">エラー: {error}</div>
        ) : Array.isArray(members) && members.length > 0 ? (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{member.user_name || `ユーザー ${member.user_id}`}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline">{member.role}</Badge>
                    {member.department_name && <Badge variant="secondary">{member.department_name}</Badge>}
                    {member.department_role && <Badge variant="secondary">{member.department_role}</Badge>}
                    <span>参加日: {member.start_date}</span>
                  </div>
                </div>
                {member.role === "プロジェクトマネージャー" && <UserCheck className="h-5 w-5 text-primary" />}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>メンバーはまだいません</p>
            <p className="text-xs mt-2">
              <Button variant="link" size="sm" onClick={handleRefresh} className="p-0 h-auto text-xs">
                再読み込み
              </Button>
              してみてください
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
