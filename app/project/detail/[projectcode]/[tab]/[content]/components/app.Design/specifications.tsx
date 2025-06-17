"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PlusCircle } from "lucide-react"

export function DesignSpecifications({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">仕様書管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">仕様書一覧</TabsTrigger>
          <TabsTrigger value="templates">テンプレート</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>仕様書一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="仕様書を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="basic">基本仕様書</SelectItem>
                    <SelectItem value="detail">詳細仕様書</SelectItem>
                    <SelectItem value="system">システム仕様書</SelectItem>
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
                    <TableHead>文書番号</TableHead>
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
                      number: "SPEC-001",
                      title: "基本設計仕様書",
                      category: "基本仕様書",
                      version: "1.0",
                      status: "承認済み",
                      date: "2024/05/01"
                    },
                    {
                      number: "SPEC-002",
                      title: "システム仕様書",
                      category: "システム仕様書",
                      version: "0.9",
                      status: "レビュー中",
                      date: "2024/05/02"
                    },
                    {
                      number: "SPEC-003",
                      title: "詳細設計仕様書",
                      category: "詳細仕様書",
                      version: "0.8",
                      status: "下書き",
                      date: "2024/05/03"
                    }
                  ].map((spec, i) => (
                    <TableRow key={i}>
                      <TableCell>{spec.number}</TableCell>
                      <TableCell>{spec.title}</TableCell>
                      <TableCell>{spec.category}</TableCell>
                      <TableCell>{spec.version}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            spec.status === "承認済み"
                              ? "default"
                              : spec.status === "レビュー中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {spec.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{spec.date}</TableCell>
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

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "基本設計仕様書テンプレート", description: "基本設計フェーズで使用する標準テンプレート" },
              { title: "詳細設計仕様書テンプレート", description: "詳細設計フェーズで使用する標準テンプレート" },
              { title: "システム仕様書テンプレート", description: "システム設計で使用する標準テンプレート" },
              { title: "機能仕様書テンプレート", description: "機能設計で使用する標準テンプレート" },
              { title: "インターフェース仕様書テンプレート", description: "インターフェース設計で使用する標準テンプレート" },
              { title: "テスト仕様書テンプレート", description: "テスト計画で使用する標準テンプレート" }
            ].map((template, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {template.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <Button variant="outline" className="mt-4">使用する</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 