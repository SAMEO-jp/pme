"use client"

import type React from "react"

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
import type { MemberHistory, Department } from "@/lib/bumon/types"

interface TransferMemberDialogProps {
  member: MemberHistory | null
  currentDepartmentCode: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TransferMemberDialog({
  member,
  currentDepartmentCode,
  open,
  onOpenChange,
  onSuccess,
}: TransferMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0])
  const [targetDepartment, setTargetDepartment] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [position, setPosition] = useState("")

  useEffect(() => {
    // 部門一覧を取得
    async function fetchDepartments() {
      try {
        const response = await fetch("/api/bumon")
        if (response.ok) {
          const data = await response.json()
          // 現在の部門を除外
          const filteredDepartments = data.departments.filter(
            (dept: Department) => dept.bumon_id !== currentDepartmentCode,
          )
          setDepartments(filteredDepartments)
        }
      } catch (error) {
        console.error("部門情報の取得に失敗しました:", error)
      }
    }

    if (open) {
      fetchDepartments()
      // メンバーの役職を初期値として設定
      if (member) {
        setPosition(member.position)
      }
    }
  }, [open, currentDepartmentCode, member])

  if (!member) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transferDate || !targetDepartment) {
      toast({
        title: "入力エラー",
        description: "すべての必須項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 1. 現在のメンバーのステータスを「移動」に更新
      const updateResponse = await fetch(`/api/bumon/member-history/${member.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "移動",
          leaveDate: transferDate,
        }),
      })

      if (!updateResponse.ok) {
        const data = await updateResponse.json()
        throw new Error(data.error || "メンバー状態の更新に失敗しました")
      }

      // 2. 新しい部門に同じメンバーの新しいレコードを作成
      const addResponse = await fetch("/api/bumon/member-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member: {
            departmentCode: targetDepartment,
            memberName: member.memberName,
            position: position,
            joinDate: transferDate,
            leaveDate: null,
            status: "在籍中",
          },
        }),
      })

      if (!addResponse.ok) {
        const data = await addResponse.json()
        throw new Error(data.error || "新しい部門へのメンバー追加に失敗しました")
      }

      toast({
        title: "メンバーが移動されました",
        description: `${member.memberName}さんの移動処理が完了しました。`,
      })

      // ダイアログを閉じる
      onOpenChange(false)

      // 成功コールバックを呼び出し（リストの再読み込みなど）
      onSuccess()
    } catch (error) {
      console.error("メンバー移動エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "メンバーの移動中にエラーが発生しました。",
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
          <DialogTitle>メンバー移動処理</DialogTitle>
          <DialogDescription>{member.memberName}さんを別の部門に移動します。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferDate" className="text-right">
                移動日
              </Label>
              <Input
                id="transferDate"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetDepartment" className="text-right">
                移動先部門
              </Label>
              <Select value={targetDepartment} onValueChange={setTargetDepartment} required>
                <SelectTrigger id="targetDepartment" className="col-span-3">
                  <SelectValue placeholder="移動先部門を選択" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.bumon_id} value={dept.bumon_id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                新しい役職
              </Label>
              <Select value={position} onValueChange={setPosition} required>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "処理中..." : "移動処理を実行"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
