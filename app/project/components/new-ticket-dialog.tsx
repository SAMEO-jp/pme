"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NewTicketDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void // チケット作成後のコールバック
}

export function NewTicketDialog({
  projectId,
  open,
  onOpenChange,
  onCreated,
}: NewTicketDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("未着手")
  const [priority, setPriority] = useState("中")
  const [assignee, setAssignee] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title || !assignee || !assigneeId || !dueDate) {
      setError("必須項目が不足しています")
      return
    }
    setLoading(true)
    setError(null)
    const id = `TICKET-${Date.now()}`
    const createdAt = new Date().toISOString().slice(0, 10)
    try {
      const res = await fetch("/api/project-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          project_id: projectId,
          title,
          status,
          priority,
          assignee,
          assignee_id: assigneeId,
          createdAt,
          dueDate
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "チケットの作成に失敗しました")
      }
      if (data.success) {
        setTitle("")
        setStatus("未着手")
        setPriority("中")
        setAssignee("")
        setAssigneeId("")
        setDueDate("")
        onOpenChange(false)
        if (onCreated) onCreated()
      } else {
        setError(data.message || "作成に失敗しました")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "作成中にエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }
  
  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setStatus("未着手")
    setPriority("中")
    setAssignee("")
    setAssigneeId("")
    setDueDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新規チケットの作成</DialogTitle>
          <DialogDescription>
            新しいチケットの詳細を入力してください。必要な情報を入力し、「作成」をクリックします。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-title" className="text-right font-medium">
              タイトル <span className="text-red-500">*</span>
            </label>
            <Input
              id="ticket-title"
              placeholder="チケットのタイトル"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-description" className="text-right font-medium">
              説明
            </label>
            <Textarea
              id="ticket-description"
              placeholder="チケットの詳細説明"
              className="col-span-3"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-status" className="text-right font-medium">
              ステータス <span className="text-red-500">*</span>
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未着手">未着手</SelectItem>
                <SelectItem value="進行中">進行中</SelectItem>
                <SelectItem value="レビュー中">レビュー中</SelectItem>
                <SelectItem value="完了">完了</SelectItem>
                <SelectItem value="問題あり">問題あり</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-priority" className="text-right font-medium">
              優先度 <span className="text-red-500">*</span>
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="高">高</SelectItem>
                <SelectItem value="中">中</SelectItem>
                <SelectItem value="低">低</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-assignee" className="text-right font-medium">
              担当者 <span className="text-red-500">*</span>
            </label>
            <Input
              id="ticket-assignee"
              placeholder="担当者名を入力"
              className="col-span-3"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-assignee-id" className="text-right font-medium">
              担当者ID <span className="text-red-500">*</span>
            </label>
            <Input
              id="ticket-assignee-id"
              placeholder="担当者IDを入力"
              className="col-span-3"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ticket-due-date" className="text-right font-medium">
              期限日
            </label>
            <Input
              id="ticket-due-date"
              type="date"
              className="col-span-3"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          {error && (
            <div className="text-red-500 text-sm mb-2">
              {error}
            </div>
          )}
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "作成中..." : "作成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 