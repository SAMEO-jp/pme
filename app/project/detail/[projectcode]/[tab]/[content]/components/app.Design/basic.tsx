"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, PlusCircle } from "lucide-react"

export function DesignBasic({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">基本設計</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">設計文書</TabsTrigger>
          <TabsTrigger value="specs">基本仕様</TabsTrigger>
          <TabsTrigger value="layout">基本レイアウト</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>設計文書一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="文書を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="mechanical">機械設計</SelectItem>
                    <SelectItem value="electrical">電気設計</SelectItem>
                    <SelectItem value="software">ソフトウェア設計</SelectItem>
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
                      number: "BAS-001",
                      title: "基本設計仕様書",
                      category: "機械設計",
                      version: "1.0",
                      status: "承認済み",
                      date: "2024/05/01"
                    },
                    {
                      number: "BAS-002",
                      title: "システム基本設計書",
                      category: "システム設計",
                      version: "0.9",
                      status: "レビュー中",
                      date: "2024/05/02"
                    },
                    {
                      number: "BAS-003",
                      title: "基本レイアウト図",
                      category: "レイアウト設計",
                      version: "0.8",
                      status: "下書き",
                      date: "2024/05/03"
                    }
                  ].map((doc, i) => (
                    <TableRow key={i}>
                      <TableCell>{doc.number}</TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{doc.version}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.status === "承認済み"
                              ? "default"
                              : doc.status === "レビュー中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.date}</TableCell>
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

        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>基本仕様</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "機能仕様",
                    description: "システムの基本機能要件",
                    type: "機能"
                  },
                  {
                    title: "性能仕様",
                    description: "システムの基本性能要件",
                    type: "性能"
                  },
                  {
                    title: "安全仕様",
                    description: "システムの基本安全要件",
                    type: "安全"
                  }
                ].map((spec, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {spec.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{spec.description}</p>
                      <Badge variant="outline" className="mt-2">{spec.type}</Badge>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">詳細</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>基本レイアウト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "設備レイアウト",
                    description: "主要設備の配置計画",
                    type: "設備"
                  },
                  {
                    title: "配管レイアウト",
                    description: "配管系統の基本配置",
                    type: "配管"
                  },
                  {
                    title: "電気レイアウト",
                    description: "電気設備の基本配置",
                    type: "電気"
                  }
                ].map((layout, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {layout.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{layout.description}</p>
                      <Badge variant="outline" className="mt-2">{layout.type}</Badge>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">詳細</Button>
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