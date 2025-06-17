"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DesignDrawings({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">図面管理</h1>
        <Button>新規アップロード</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>図面一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input placeholder="図面を検索..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="layout">レイアウト図</SelectItem>
                <SelectItem value="system">システム図</SelectItem>
                <SelectItem value="detail">詳細図</SelectItem>
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
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>図面番号</TableHead>
                <TableHead>タイトル</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>バージョン</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  number: "DWG-001",
                  title: "基本レイアウト図",
                  category: "レイアウト図",
                  version: "1.0",
                  status: "承認済み",
                  date: "2024/05/01"
                },
                {
                  number: "DWG-002",
                  title: "システム構成図",
                  category: "システム図",
                  version: "0.9",
                  status: "レビュー中",
                  date: "2024/05/02"
                },
                {
                  number: "DWG-003",
                  title: "詳細配管図",
                  category: "詳細図",
                  version: "0.8",
                  status: "下書き",
                  date: "2024/05/03"
                }
              ].map((drawing, i) => (
                <TableRow key={i}>
                  <TableCell>{drawing.number}</TableCell>
                  <TableCell>{drawing.title}</TableCell>
                  <TableCell>{drawing.category}</TableCell>
                  <TableCell>{drawing.version}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        drawing.status === "承認済み"
                          ? "default"
                          : drawing.status === "レビュー中"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {drawing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{drawing.date}</TableCell>
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
    </div>
  )
} 