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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMemberFormProps {
  bumon_id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddMemberForm({ bumon_id, open, onOpenChange, onSuccess }: AddMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [position, setPosition] = useState("")
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!memberName || !position || !joinDate) {
      toast({
        title: "入力エラー",
        description: "すべての必須項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/bumon/member-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member: {
            bumon_id,
            memberName,
            position,
            joinDate,
            leaveDate: null,
            status: "在籍中",
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "メンバー追加に失敗しました")
      }

      toast({
        title: "メンバーが追加されました",
        description: "部門メンバーの追加が完了しました。",
      })

      // フォームをリセット
      setMemberName("")
      setPosition("")
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
          <DialogTitle>部門メンバー追加</DialogTitle>
          <DialogDescription>部門「{bumon_id}」に新しいメンバーを追加します。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memberName" className="text-right">
                氏名
              </Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                役職
              </Label>
              <Select value={position} onValueChange={setPosition} required>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                配属日
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
