"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { LogIn, LogOut, UserPlus, UserMinus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepartmentMembershipProps {
  departmentCode: string
  departmentName: string
}

export function DepartmentMembership({ departmentCode, departmentName }: DepartmentMembershipProps) {
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [targetUserId, setTargetUserId] = useState("")
  const [position, setPosition] = useState("社員")

  // 現在のユーザーIDを取得（実際の実装ではログイン情報から取得）
  useEffect(() => {
    // 仮のユーザーID（実際の実装では認証システムから取得）
    const currentUserId = localStorage.getItem("currentUserId") || ""
    setUserId(currentUserId)

    if (currentUserId) {
      checkMembership(currentUserId)
    }
  }, [departmentCode])

  const checkMembership = async (uid: string) => {
    try {
      const response = await fetch(`/api/bumon/membership?departmentCode=${departmentCode}&userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setIsMember(data.isMember)
      }
    } catch (error) {
      console.error("メンバーシップ確認エラー:", error)
    }
  }

  const handleJoin = async () => {
    if (!userId) {
      toast({
        title: "ユーザーIDが設定されていません",
        description: "ユーザーIDを設定してください",
        variant: "destructive",
      })
      return
    }

    console.log('部門参加処理を開始:', { userId, departmentCode, position });
    setIsLoading(true)
    try {
      const requestData = {
        userId,
        departmentCode,
        position,
        action: "join",
      };
      console.log('APIリクエスト送信:', requestData);
      
      const response = await fetch("/api/bumon/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log('APIレスポンス:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('レスポンスデータ:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "部門への参加に失敗しました")
      }

      toast({
        title: "部門に参加しました",
        description: `${departmentName}に参加しました`,
      })
      setIsMember(true)
    } catch (error) {
      console.error("部門参加エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "部門への参加中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!userId) {
      toast({
        title: "ユーザーIDが設定されていません",
        description: "ユーザーIDを設定してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bumon/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          departmentCode,
          action: "leave",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "部門からの退出に失敗しました")
      }

      toast({
        title: "部門から退出しました",
        description: `${departmentName}から退出しました`,
      })
      setIsMember(false)
    } catch (error) {
      console.error("部門退出エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "部門からの退出中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinOther = async () => {
    if (!targetUserId) {
      toast({
        title: "ユーザーIDが入力されていません",
        description: "参加させるユーザーIDを入力してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bumon/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: targetUserId,
          departmentCode,
          position,
          action: "join",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "ユーザーの部門参加に失敗しました")
      }

      toast({
        title: "ユーザーを部門に参加させました",
        description: `ユーザー ${targetUserId} を ${departmentName} に参加させました`,
      })
      setIsJoinDialogOpen(false)
      setTargetUserId("")
    } catch (error) {
      console.error("ユーザー部門参加エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "ユーザーの部門参加中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveOther = async () => {
    if (!targetUserId) {
      toast({
        title: "ユーザーIDが入力されていません",
        description: "退出させるユーザーIDを入力してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bumon/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: targetUserId,
          departmentCode,
          action: "leave",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "ユーザーの部門退出に失敗しました")
      }

      toast({
        title: "ユーザーを部門から退出させました",
        description: `ユーザー ${targetUserId} を ${departmentName} から退出させました`,
      })
      setIsLeaveDialogOpen(false)
      setTargetUserId("")
    } catch (error) {
      console.error("ユーザー部門退出エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "ユーザーの部門退出中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ユーザーID設定用の関数（デモ用）
  const setCurrentUserId = (id: string) => {
    localStorage.setItem("currentUserId", id)
    setUserId(id)
    checkMembership(id)
  }

  return (
    <div className="space-y-4">
      {/* デモ用：ユーザーID設定 */}
      <div className="p-4 border rounded-md bg-gray-50">
        <h3 className="text-sm font-medium mb-2">デモ用：ユーザーID設定</h3>
        <div className="flex gap-2">
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ユーザーID"
            className="max-w-xs"
          />
          <Button size="sm" onClick={() => setCurrentUserId(userId)}>
            設定
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">現在のユーザーID: {userId || "未設定"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 自分自身の参加/退出 */}
        <div className="flex gap-2">
          <Button
            onClick={handleJoin}
            disabled={isLoading || isMember === true}
            variant={isMember === true ? "outline" : "default"}
          >
            <LogIn className="mr-2 h-4 w-4" />
            この部門に参加する
          </Button>
          <Button
            onClick={handleLeave}
            disabled={isLoading || isMember === false}
            variant={isMember === false ? "outline" : "default"}
          >
            <LogOut className="mr-2 h-4 w-4" />
            この部門から退出する
          </Button>
        </div>

        {/* 他のユーザーの参加/退出 */}
        <div className="flex gap-2">
          <Button onClick={() => setIsJoinDialogOpen(true)} variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            この部門に参加させる
          </Button>
          <Button onClick={() => setIsLeaveDialogOpen(true)} variant="outline">
            <UserMinus className="mr-2 h-4 w-4" />
            この部門から退出させる
          </Button>
        </div>
      </div>

      {/* 他のユーザーを参加させるダイアログ */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ユーザーを部門に参加させる</DialogTitle>
            <DialogDescription>参加させるユーザーのIDと役職を入力してください。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetUserId" className="text-right">
                ユーザーID
              </Label>
              <Input
                id="targetUserId"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                役職
              </Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position" className="col-span-3">
                  <SelectValue placeholder="役職を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="部長">部長</SelectItem>
                  <SelectItem value="課長">課長</SelectItem>
                  <SelectItem value="主任">主任</SelectItem>
                  <SelectItem value="社員">社員</SelectItem>
                  <SelectItem value="契約社員">契約社員</SelectItem>
                  <SelectItem value="アルバイト">アルバイト</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsJoinDialogOpen(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button onClick={handleJoinOther} disabled={isLoading}>
              {isLoading ? "処理中..." : "参加させる"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 他のユーザーを退出させるダイアログ */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ユーザーを部門から退出させる</DialogTitle>
            <DialogDescription>退出させるユーザーのIDを入力してください。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetUserId" className="text-right">
                ユーザーID
              </Label>
              <Input
                id="targetUserId"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button onClick={handleLeaveOther} disabled={isLoading} variant="destructive">
              {isLoading ? "処理中..." : "退出させる"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
