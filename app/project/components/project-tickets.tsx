"use client"

import { useState, useEffect } from "react"
import { TicketDetailDialog } from "./ticket-detail-dialog"
import { NewTicketDialog } from "./new-ticket-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, FileEdit } from "lucide-react"

interface ProjectTicketsProps {
  projectId: string
}

// ダミーデータ
const DUMMY_TICKETS = [
  {
    id: "TICKET-001",
    title: "システム要件の定義",
    status: "完了",
    priority: "高",
    assignee: "山田太郎",
    createdAt: "2025-04-15",
    dueDate: "2025-04-20",
  },
  {
    id: "TICKET-002",
    title: "データベース設計書の作成",
    status: "進行中",
    priority: "高",
    assignee: "佐藤花子",
    createdAt: "2025-04-16",
    dueDate: "2025-04-25",
  },
  {
    id: "TICKET-003",
    title: "UI/UXデザインの検討",
    status: "未着手",
    priority: "中",
    assignee: "田中次郎",
    createdAt: "2025-04-16",
    dueDate: "2025-04-28",
  },
  {
    id: "TICKET-004",
    title: "APIエンドポイントの設計",
    status: "レビュー中",
    priority: "中",
    assignee: "鈴木一郎",
    createdAt: "2025-04-17",
    dueDate: "2025-04-22",
  },
  {
    id: "TICKET-005",
    title: "セキュリティ対策の検討",
    status: "問題あり",
    priority: "高",
    assignee: "山田太郎",
    createdAt: "2025-04-18",
    dueDate: "2025-04-30",
  },
]

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

// ヘルパー関数：ステータスに対応したバリアントを安全に取得
const getStatusVariant = (status: string): "default" | "outline" | "destructive" | "secondary" => {
  return STATUS_BADGE_VARIANTS[status] || "default";
}

// ヘルパー関数：優先度に対応したバリアントを安全に取得
const getPriorityVariant = (priority: string): "default" | "outline" | "destructive" | "secondary" => {
  return PRIORITY_BADGE_VARIANTS[priority] || "default";
}

export function ProjectTickets({ projectId }: ProjectTicketsProps) {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/project-tickets?projectId=${projectId}`)
        const data = await res.json()
        if (data.success) {
          setTickets(data.data)
        } else {
          setError(data.message || "チケットの取得に失敗しました")
        }
      } catch (e) {
        setError("チケットの取得中にエラーが発生しました")
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [projectId])

  if (loading) return <div className="text-center py-4">読み込み中...</div>
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>
  if (tickets.length === 0) return <div className="text-center py-4">チケットが登録されていません</div>

  // フィルタリング処理
  const filteredTickets = tickets.filter(ticket => {
    // 検索クエリでフィルタリング
    if (searchQuery && !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // ステータスでフィルタリング
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false
    }
    
    // 優先度でフィルタリング
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
      return false
    }
    
    // 担当者でフィルタリング
    if (assigneeFilter !== "all" && ticket.assignee !== assigneeFilter) {
      return false
    }
    
    return true
  })

  // チケット詳細を表示
  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setTicketDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-grow">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="チケットを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2 space-y-2">
                <div>
                  <label className="text-xs font-medium">ステータス</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="未着手">未着手</SelectItem>
                      <SelectItem value="進行中">進行中</SelectItem>
                      <SelectItem value="レビュー中">レビュー中</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                      <SelectItem value="問題あり">問題あり</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">優先度</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="高">高</SelectItem>
                      <SelectItem value="中">中</SelectItem>
                      <SelectItem value="低">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">担当者</label>
                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="山田太郎">山田太郎</SelectItem>
                      <SelectItem value="佐藤花子">佐藤花子</SelectItem>
                      <SelectItem value="田中次郎">田中次郎</SelectItem>
                      <SelectItem value="鈴木一郎">鈴木一郎</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => setNewTicketDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新規チケット
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="w-full">タイトル</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>優先度</TableHead>
              <TableHead>担当者</TableHead>
              <TableHead>期限</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{ticket.dueDate}</TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTicketClick(ticket.id)}>
                            <FileEdit className="h-4 w-4 mr-2" />
                            詳細を見る
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  該当するチケットがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* チケット詳細ダイアログ */}
      <TicketDetailDialog
        ticketId={selectedTicketId}
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
      />
      
      {/* 新規チケット作成ダイアログ */}
      <NewTicketDialog
        projectId={projectId}
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
      />
    </div>
  )
} 