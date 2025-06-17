"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Ticket {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assignee: string
  reporter?: string
  createdAt: string
  dueDate: string
  comments?: Array<{
    id: string
    author: string
    message: string
    createdAt: string
  }>
}

interface TicketDetailDialogProps {
  ticketId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ステータスに対応したバッジのスタイル
const STATUS_BADGE_VARIANTS: Record<string, "default" | "outline" | "destructive" | "secondary"> = {
  "完了": "secondary",
  "進行中": "default",
  "レビュー中": "secondary",
  "未着手": "outline",
  "問題あり": "destructive"
}

// 優先度に対応したバッジのスタイル
const PRIORITY_BADGE_VARIANTS: Record<string, "default" | "outline" | "destructive" | "secondary"> = {
  "高": "destructive",
  "中": "secondary",
  "低": "outline"
}

// バリアント型を取得するヘルパー関数
const getStatusVariant = (status: string): "default" | "outline" | "destructive" | "secondary" => {
  return STATUS_BADGE_VARIANTS[status] || "default";
}

const getPriorityVariant = (priority: string): "default" | "outline" | "destructive" | "secondary" => {
  return PRIORITY_BADGE_VARIANTS[priority] || "default";
}

export function TicketDetailDialog({ ticketId, open, onOpenChange }: TicketDetailDialogProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [assignee, setAssignee] = useState("")
  const [assigneeId, setAssigneeId] = useState("")

  // ダミーデータのフェッチをシミュレート
  useEffect(() => {
    if (ticketId && open) {
      setLoading(true)
      // 実際のAPIコールの代わりにダミーデータを使用
      setTimeout(() => {
        setTicket({
          id: ticketId,
          title: ticketId === "TICKET-001" ? "システム要件の定義" : "データベース設計書の作成",
          description: "このチケットはプロジェクトの要件を明確にするためのものです。すべてのステークホルダーの要件を収集し、整理する必要があります。\n\n- 機能要件の整理\n- 非機能要件の整理\n- システム構成の検討",
          status: ticketId === "TICKET-001" ? "完了" : "進行中",
          priority: "高",
          assignee: ticketId === "TICKET-001" ? "山田太郎" : "佐藤花子",
          reporter: "鈴木一郎",
          createdAt: "2025-04-15",
          dueDate: "2025-04-20",
          comments: [
            {
              id: "1",
              author: "田中次郎",
              message: "要件定義のテンプレートを共有します。こちらを参考にしてください。",
              createdAt: "2025-04-16 10:30"
            },
            {
              id: "2",
              author: "山田太郎",
              message: "テンプレートありがとうございます。いくつか質問があります。\n1. セキュリティ要件はどこまで含めるべきですか？\n2. パフォーマンス要件の基準値はありますか？",
              createdAt: "2025-04-16 11:15"
            },
            {
              id: "3",
              author: "鈴木一郎",
              message: "明日のミーティングで詳細を議論しましょう。重要な点をリストアップしておいてください。",
              createdAt: "2025-04-16 14:45"
            }
          ]
        })
        setLoading(false)
      }, 500)
    } else {
      setTicket(null)
    }
  }, [ticketId, open])

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return

    // 実際のAPIコールの代わりにUIの更新をシミュレート
    if (ticket && ticket.comments) {
      const updatedTicket = {
        ...ticket,
        comments: [
          ...ticket.comments,
          {
            id: `${ticket.comments.length + 1}`,
            author: "現在のユーザー",
            message: newComment,
            createdAt: new Date().toLocaleString()
          }
        ]
      }
      setTicket(updatedTicket)
      setNewComment("")
    }
  }

  const handleSave = async () => {
    if (!ticket) return

    try {
      setLoading(true)
      const response = await fetch(`/api/project-tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ticket,
          assignee,
          assignee_id: assigneeId
        })
      })

      if (response.ok) {
        setTicket({
          ...ticket,
          assignee,
          assignee_id: assigneeId
        })
      } else {
        console.error("Failed to update ticket")
      }
    } catch (error) {
      console.error("Error updating ticket:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ticket ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
                <Badge variant={getStatusVariant(ticket.status)}>
                  {ticket.status}
                </Badge>
                <Badge variant={getPriorityVariant(ticket.priority)}>
                  優先度: {ticket.priority}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  作成日: {ticket.createdAt}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  期限: {ticket.dueDate}
                </span>
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="details">詳細</TabsTrigger>
                <TabsTrigger value="comments">コメント ({ticket.comments?.length || 0})</TabsTrigger>
                <TabsTrigger value="history">履歴</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">担当者</h3>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{ticket.assignee.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{ticket.assignee}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">報告者</h3>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{ticket.reporter?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span>{ticket.reporter || "不明"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">説明</h3>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
                      {ticket.description || "説明はありません"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">ステータス</label>
                      <Select defaultValue={ticket.status}>
                        <SelectTrigger className="w-full">
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
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">優先度</label>
                      <Select defaultValue={ticket.priority}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="高">高</SelectItem>
                          <SelectItem value="中">中</SelectItem>
                          <SelectItem value="低">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">担当者</label>
                      <Select defaultValue={ticket.assignee}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="担当者を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="山田太郎">山田太郎</SelectItem>
                          <SelectItem value="佐藤花子">佐藤花子</SelectItem>
                          <SelectItem value="田中次郎">田中次郎</SelectItem>
                          <SelectItem value="鈴木一郎">鈴木一郎</SelectItem>
                          <SelectItem value="高橋健太">高橋健太</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">担当者名</label>
                    <Input value={assignee} onChange={e => setAssignee(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">担当者ID</label>
                    <Input value={assigneeId} onChange={e => setAssigneeId(e.target.value)} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comments">
                <div className="space-y-4">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    <div className="space-y-4">
                      {ticket.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{comment.author}</span>
                            </div>
                            <span className="text-sm text-gray-500">{comment.createdAt}</span>
                          </div>
                          <p className="whitespace-pre-line">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      コメントはまだありません
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">新しいコメント</h3>
                    <Textarea
                      placeholder="コメントを入力..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                      rows={3}
                    />
                    <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      コメントを追加
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">田中次郎</span>
                        <span className="text-sm text-gray-500 ml-2">2025-04-16 14:30</span>
                      </div>
                      <p className="text-sm">ステータスを「未着手」から「進行中」に変更しました</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">山田太郎</span>
                        <span className="text-sm text-gray-500 ml-2">2025-04-15 09:15</span>
                      </div>
                      <p className="text-sm">担当者を「未割当」から「山田太郎」に変更しました</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">鈴木一郎</span>
                        <span className="text-sm text-gray-500 ml-2">2025-04-15 09:00</span>
                      </div>
                      <p className="text-sm">チケットを作成しました</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  問題を報告
                </Button>
                <Button variant="outline">チケットを閉じる</Button>
                <Button onClick={handleSave}>変更を保存</Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            チケットが見つかりません
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 