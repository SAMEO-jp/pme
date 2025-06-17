"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, PlusCircle } from "lucide-react"

export function DesignDetail({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">詳細設計</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規作成
          </Button>
      </div>
      
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">設計文書</TabsTrigger>
          <TabsTrigger value="components">部品表</TabsTrigger>
          <TabsTrigger value="interfaces">インターフェース</TabsTrigger>
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
                      number: "DET-001",
                      title: "機械部品詳細設計書",
                      category: "機械設計",
                      version: "1.0",
                      status: "承認済み",
                      date: "2024/05/01"
                    },
                    {
                      number: "DET-002",
                      title: "制御システム設計書",
                      category: "電気設計",
                      version: "0.9",
                      status: "レビュー中",
                      date: "2024/05/02"
                    },
                    {
                      number: "DET-003",
                      title: "ソフトウェア詳細設計書",
                      category: "ソフトウェア設計",
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

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>部品表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="部品を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="mechanical">機械部品</SelectItem>
                    <SelectItem value="electrical">電気部品</SelectItem>
                    <SelectItem value="software">ソフトウェア</SelectItem>
                  </SelectContent>
                </Select>
            </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部品番号</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>数量</TableHead>
                    <TableHead>単価</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      number: "P-001",
                      name: "モーター",
                      category: "機械部品",
                      quantity: 2,
                      price: "¥50,000"
                    },
                    {
                      number: "P-002",
                      name: "制御基板",
                      category: "電気部品",
                      quantity: 1,
                      price: "¥100,000"
                    },
                    {
                      number: "P-003",
                      name: "センサー",
                      category: "電気部品",
                      quantity: 4,
                      price: "¥20,000"
                    }
                  ].map((part, i) => (
                    <TableRow key={i}>
                      <TableCell>{part.number}</TableCell>
                      <TableCell>{part.name}</TableCell>
                      <TableCell>{part.category}</TableCell>
                      <TableCell>{part.quantity}</TableCell>
                      <TableCell>{part.price}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">詳細</Button>
                          <Button variant="outline" size="sm">編集</Button>
            </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="interfaces">
          <Card>
            <CardHeader>
              <CardTitle>インターフェース定義</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "機械インターフェース",
                    description: "機械部品間の接続仕様",
                    type: "機械"
                  },
                  {
                    title: "電気インターフェース",
                    description: "電気部品間の接続仕様",
                    type: "電気"
                  },
                  {
                    title: "ソフトウェアインターフェース",
                    description: "ソフトウェア間の通信仕様",
                    type: "ソフトウェア"
                  }
                ].map((iface, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {iface.title}
                      </CardTitle>
        </CardHeader>
        <CardContent>
                      <p className="text-sm text-muted-foreground">{iface.description}</p>
                      <Badge variant="outline" className="mt-2">{iface.type}</Badge>
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