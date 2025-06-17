"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, PlusCircle } from "lucide-react"

export function DesignCalculations({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">計算書管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">計算書一覧</TabsTrigger>
          <TabsTrigger value="formulas">計算式</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>計算書一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="計算書を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="structural">構造計算</SelectItem>
                    <SelectItem value="thermal">熱計算</SelectItem>
                    <SelectItem value="fluid">流体計算</SelectItem>
                    <SelectItem value="electrical">電気計算</SelectItem>
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
                      number: "CALC-001",
                      title: "構造強度計算書",
                      category: "構造計算",
                      version: "1.0",
                      status: "承認済み",
                      date: "2024/05/01"
                    },
                    {
                      number: "CALC-002",
                      title: "熱負荷計算書",
                      category: "熱計算",
                      version: "0.9",
                      status: "レビュー中",
                      date: "2024/05/02"
                    },
                    {
                      number: "CALC-003",
                      title: "配管圧力損失計算書",
                      category: "流体計算",
                      version: "0.8",
                      status: "下書き",
                      date: "2024/05/03"
                    }
                  ].map((calc, i) => (
                    <TableRow key={i}>
                      <TableCell>{calc.number}</TableCell>
                      <TableCell>{calc.title}</TableCell>
                      <TableCell>{calc.category}</TableCell>
                      <TableCell>{calc.version}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            calc.status === "承認済み"
                              ? "default"
                              : calc.status === "レビュー中"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {calc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{calc.date}</TableCell>
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

        <TabsContent value="formulas">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "構造強度計算式", description: "梁の曲げ応力計算", category: "構造計算" },
              { title: "熱伝導計算式", description: "壁体の熱伝導率計算", category: "熱計算" },
              { title: "圧力損失計算式", description: "配管の圧力損失計算", category: "流体計算" },
              { title: "電力消費計算式", description: "モーターの電力消費計算", category: "電気計算" },
              { title: "振動計算式", description: "機械の固有振動数計算", category: "構造計算" },
              { title: "熱交換計算式", description: "熱交換器の効率計算", category: "熱計算" }
            ].map((formula, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4" />
                    {formula.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{formula.description}</p>
                  <Badge variant="outline" className="mt-2">{formula.category}</Badge>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">編集</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 