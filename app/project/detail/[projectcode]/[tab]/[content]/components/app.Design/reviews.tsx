"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, PlusCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DesignReviews({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">レビュー管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規レビュー
        </Button>
      </div>

      {/* 進捗ダッシュボード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">レビュー全体進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">レビュー待ち項目</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8件</div>
            <div className="text-xs text-muted-foreground mt-1">3件が緊急</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未解決コメント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12件</div>
            <div className="text-xs text-muted-foreground mt-1">5件が優先度高</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">レビュー一覧</TabsTrigger>
          <TabsTrigger value="comments">コメント一覧</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>レビュー一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="レビューを検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="basic">基本設計レビュー</SelectItem>
                    <SelectItem value="detail">詳細設計レビュー</SelectItem>
                    <SelectItem value="system">システムレビュー</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="pending">待ち</SelectItem>
                    <SelectItem value="in_progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>レビュー番号</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>レビュアー</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>期限</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      number: "REV-001",
                      title: "基本設計書レビュー",
                      category: "基本設計レビュー",
                      reviewer: "山田太郎",
                      status: "進行中",
                      deadline: "2024/05/10"
                    },
                    {
                      number: "REV-002",
                      title: "システム構成レビュー",
                      category: "システムレビュー",
                      reviewer: "鈴木一郎",
                      status: "待ち",
                      deadline: "2024/05/15"
                    },
                    {
                      number: "REV-003",
                      title: "詳細設計書レビュー",
                      category: "詳細設計レビュー",
                      reviewer: "佐藤次郎",
                      status: "完了",
                      deadline: "2024/05/05"
                    }
                  ].map((review, i) => (
                    <TableRow key={i}>
                      <TableCell>{review.number}</TableCell>
                      <TableCell>{review.title}</TableCell>
                      <TableCell>{review.category}</TableCell>
                      <TableCell>{review.reviewer}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            review.status === "完了"
                              ? "default"
                              : review.status === "進行中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{review.deadline}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">表示</Button>
                          <Button variant="outline" size="sm">編集</Button>
                          <Button variant="outline" size="sm">コメント</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>コメント一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    reviewNumber: "REV-001",
                    title: "基本設計書レビュー",
                    content: "システム構成の冗長性について確認が必要です。",
                    author: "山田太郎",
                    date: "2024/05/01",
                    status: "未解決"
                  },
                  {
                    reviewNumber: "REV-002",
                    title: "システム構成レビュー",
                    content: "セキュリティ要件の実装方法について検討が必要です。",
                    author: "鈴木一郎",
                    date: "2024/05/02",
                    status: "対応中"
                  },
                  {
                    reviewNumber: "REV-003",
                    title: "詳細設計書レビュー",
                    content: "パフォーマンス要件の達成方法について確認が必要です。",
                    author: "佐藤次郎",
                    date: "2024/05/03",
                    status: "解決済み"
                  }
                ].map((comment, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <CardTitle className="text-lg">{comment.title}</CardTitle>
                        </div>
                        <Badge
                          variant={
                            comment.status === "解決済み"
                              ? "default"
                              : comment.status === "対応中"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {comment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>レビュー番号: {comment.reviewNumber}</span>
                          <span>•</span>
                          <span>投稿者: {comment.author}</span>
                          <span>•</span>
                          <span>日付: {comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 