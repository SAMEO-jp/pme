"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Member {
  id: number
  name: string
  department?: string
}

interface AddProjectMemberFormProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddProjectMemberForm({ projectId, open, onOpenChange, onSuccess }: AddProjectMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [role, setRole] = useState("メンバー")
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split("T")[0])
  
  // メンバー一覧を取得
  useEffect(() => {
    if (open) {
      fetchAvailableMembers()
    }
  }, [open])
  
  const fetchAvailableMembers = async () => {
    try {
      const response = await fetch("/api/members/available")
      if (!response.ok) {
        throw new Error("メンバー情報の取得に失敗しました")
      }
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("メンバーの取得エラー:", error)
      toast({
        title: "エラー",
        description: "メンバー情報の取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMemberId || !role || !joinDate) {
      toast({
        title: "入力エラー",
        description: "すべての必須項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/project/members/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          memberId: selectedMemberId,
          role,
          joinDate,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "メンバー追加に失敗しました")
      }

      toast({
        title: "メンバーが追加されました",
        description: "プロジェクトメンバーの追加が完了しました。",
      })

      // フォームをリセット
      setSelectedMemberId("")
      setRole("メンバー")
      setJoinDate(new Date().toISOString().split("T")[0])

      // ダイアログを閉じる
      onOpenChange(false)

      // 成功コールバックを呼び出し（リストの再読み込みなど）
      onSuccess()
    } catch (error) {
      console.error("メンバー追加エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "メンバーの追加中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>プロジェクトメンバー追加</DialogTitle>
          <DialogDescription>プロジェクトに新しいメンバーを追加します。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memberId" className="text-right">
                メンバー
              </Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="メンバーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name} {member.department ? `(${member.department})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                役割
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="役割を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="プロジェクトマネージャー">プロジェクトマネージャー</SelectItem>
                  <SelectItem value="リーダー">リーダー</SelectItem>
                  <SelectItem value="メンバー">メンバー</SelectItem>
                  <SelectItem value="アドバイザー">アドバイザー</SelectItem>
                  <SelectItem value="オブザーバー">オブザーバー</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                参加日
              </Label>
              <Input
                id="joinDate"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "追加中..." : "追加する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 