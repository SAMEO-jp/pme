"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, PlusCircle } from "lucide-react"

export function DesignChanges({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">設計変更管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規変更申請
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">変更申請一覧</TabsTrigger>
          <TabsTrigger value="history">変更履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>変更申請一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="変更申請を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="spec">仕様変更</SelectItem>
                    <SelectItem value="layout">レイアウト変更</SelectItem>
                    <SelectItem value="system">システム変更</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="review">レビュー中</SelectItem>
                    <SelectItem value="approved">承認済み</SelectItem>
                    <SelectItem value="rejected">却下</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申請番号</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>申請者</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>申請日</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      number: "CHG-001",
                      title: "基本仕様の変更",
                      category: "仕様変更",
                      requester: "山田太郎",
                      status: "承認済み",
                      date: "2024/05/01"
                    },
                    {
                      number: "CHG-002",
                      title: "レイアウトの最適化",
                      category: "レイアウト変更",
                      requester: "鈴木一郎",
                      status: "レビュー中",
                      date: "2024/05/02"
                    },
                    {
                      number: "CHG-003",
                      title: "システム構成の見直し",
                      category: "システム変更",
                      requester: "佐藤次郎",
                      status: "下書き",
                      date: "2024/05/03"
                    }
                  ].map((change, i) => (
                    <TableRow key={i}>
                      <TableCell>{change.number}</TableCell>
                      <TableCell>{change.title}</TableCell>
                      <TableCell>{change.category}</TableCell>
                      <TableCell>{change.requester}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            change.status === "承認済み"
                              ? "default"
                              : change.status === "レビュー中"
                              ? "secondary"
                              : change.status === "却下"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {change.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{change.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">表示</Button>
                          <Button variant="outline" size="sm">編集</Button>
                          <Button variant="outline" size="sm">履歴</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>変更履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "2024/05/01",
                    title: "基本仕様の変更",
                    category: "仕様変更",
                    status: "承認済み",
                    description: "設計容量の見直しによる基本仕様の変更"
                  },
                  {
                    date: "2024/04/28",
                    title: "レイアウトの最適化",
                    category: "レイアウト変更",
                    status: "承認済み",
                    description: "作業効率向上のためのレイアウト変更"
                  },
                  {
                    date: "2024/04/25",
                    title: "システム構成の見直し",
                    category: "システム変更",
                    status: "承認済み",
                    description: "コスト削減のためのシステム構成の見直し"
                  }
                ].map((history, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="h-4 w-4" />
                          <CardTitle className="text-lg">{history.title}</CardTitle>
                        </div>
                        <Badge
                          variant={
                            history.status === "承認済み"
                              ? "default"
                              : history.status === "レビュー中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {history.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>日付: {history.date}</span>
                          <span>•</span>
                          <span>カテゴリ: {history.category}</span>
                        </div>
                        <p className="text-sm">{history.description}</p>
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