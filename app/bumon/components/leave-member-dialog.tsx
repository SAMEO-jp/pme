"use client"

import type React from "react"

import { useState } from "react"
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
import type { MemberHistory } from "@/lib/bumon/types"

interface LeaveMemberDialogProps {
  member: MemberHistory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function LeaveMemberDialog({ member, open, onOpenChange, onSuccess }: LeaveMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split("T")[0])

  if (!member) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!leaveDate) {
      toast({
        title: "入力エラー",
        description: "退職日を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/bumon/member-history/${member.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "退職",
          leaveDate,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "メンバー状態の更新に失敗しました")
      }

      toast({
        title: "メンバー状態が更新されました",
        description: "メンバーの退職処理が完了しました。",
      })

      // ダイアログを閉じる
      onOpenChange(false)

      // 成功コールバックを呼び出し（リストの再読み込みなど）
      onSuccess()
    } catch (error) {
      console.error("メンバー状態更新エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "メンバー状態の更新中にエラーが発生しました。",
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
          <DialogTitle>メンバー退職処理</DialogTitle>
          <DialogDescription>{member.memberName}さんの退職日を入力してください。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leaveDate" className="text-right">
                退職日
              </Label>
              <Input
                id="leaveDate"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? "処理中..." : "退職処理を実行"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
