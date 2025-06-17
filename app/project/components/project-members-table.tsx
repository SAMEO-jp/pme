"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, ExternalLink, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

type MemberDisplayMode = "current" | "past" | "all"

interface ProjectMembersTableProps {
  projectId: string
}

export function ProjectMembersTable({ projectId }: ProjectMembersTableProps) {
  const router = useRouter()
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [leavingMember, setLeavingMember] = useState<ProjectMember | null>(null)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [displayMode, setDisplayMode] = useState<MemberDisplayMode>("current")

  // メンバー一覧を取得
  const fetchMembers = async () => {
    setLoading(true)
      setError(null)
    try {
      console.log("Fetching members for project:", projectId)
      const response = await fetch(`/api/project/members/table/${projectId}`)
      if (!response.ok) {
        throw new Error("メンバー一覧の取得に失敗しました")
      }
      const data = await response.json()
      console.log("Fetched members:", data)
      setMembers(data)
    } catch (err) {
      console.error("Error fetching members:", err)
      setError(err instanceof Error ? err.message : "エラーが発生しました")
      toast({
        title: "エラー",
        description: "メンバー一覧の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("Loading state set to false")
    }
  }

  // 表示モードに応じてメンバーをフィルタリング
  const filteredMembers = members.filter(member => {
    const today = new Date().toISOString().split('T')[0]
    
    switch (displayMode) {
      case "current":
        // 現在のメンバー: end_dateがnullまたは未来の日付
        return !member.end_date || member.end_date > today
      case "past":
        // 過去のメンバー: end_dateが存在し、現在日付以前
        return member.end_date !== null && member.end_date <= today
      case "all":
        return true
      default:
        return true
    }
  })

  // プロジェクトに参加
  const handleJoin = async () => {
    setJoining(true)
    try {
      console.log("Attempting to join project:", projectId)
      const response = await fetch("/api/project/members/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, role: "メンバー" }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        console.log("Error response received:", data)
        throw new Error(data.error || "プロジェクトへの参加に失敗しました")
      }

      toast({
        title: "参加しました",
        description: "プロジェクトに参加しました",
      })

      // メンバー一覧を更新
      fetchMembers()
    } catch (error) {
      console.error("Error in handleJoin:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "プロジェクトへの参加に失敗しました",
        variant: "destructive",
      })
    } finally {
      setJoining(false)
    }
  }

  // メンバー詳細ページへ遷移
  const handleViewDetails = (userId: string | number) => {
    router.push(`/project/person/${userId}`)
  }

  // 退出確認ダイアログを表示
  const handleLeaveClick = (member: ProjectMember) => {
    setLeavingMember(member)
    setShowLeaveDialog(true)
  }

  // プロジェクトから退出
  const handleLeave = async () => {
    if (!leavingMember) return

    try {
      const response = await fetch("/api/project/members/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        throw new Error("プロジェクトからの退出に失敗しました")
      }

      toast({
        title: "退出しました",
        description: "プロジェクトから退出しました",
      })

      // メンバー一覧を更新
      fetchMembers()
    } catch (error) {
      toast({
        title: "エラー",
        description: "プロジェクトからの退出に失敗しました",
        variant: "destructive",
      })
    } finally {
      setShowLeaveDialog(false)
      setLeavingMember(null)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchMembers()
    }
  }, [projectId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle>プロジェクトメンバー</CardTitle>
          <Select value={displayMode} onValueChange={(value: MemberDisplayMode) => setDisplayMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="表示モードを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">現在のメンバー</SelectItem>
              <SelectItem value="past">過去のメンバー</SelectItem>
              <SelectItem value="all">すべてのメンバー</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={handleJoin} disabled={joining}>
            <UserPlus className="h-4 w-4 mr-2" />
            {joining ? "参加中..." : "参加"}
        </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">エラー: {error}</div>
        ) : (
          <Table>
            <TableCaption>プロジェクトメンバー一覧</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>参加日</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.user_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>{member.start_date}</TableCell>
                  <TableCell>
                    {member.end_date ? (
                      <Badge variant="secondary">退会</Badge>
                    ) : (
                      <Badge variant="default">在籍中</Badge>
                    )}
                  </TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(member.user_id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        詳細
                      </Button>
                      {!member.end_date && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleLeaveClick(member)}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          退出
                        </Button>
                      )}
                    </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>プロジェクトからの退出</AlertDialogTitle>
            <AlertDialogDescription>
              本当にこのプロジェクトから退出しますか？
              この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>退出する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
} 