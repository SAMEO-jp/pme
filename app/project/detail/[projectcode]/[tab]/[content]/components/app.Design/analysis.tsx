"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, PlusCircle, BarChart2, LineChart, PieChart } from "lucide-react"

export function DesignAnalysis({ project }: { project: any }) {
  return (
    <div>


      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
          <TabsTrigger value="cost">コスト分析</TabsTrigger>
          <TabsTrigger value="risk">リスク分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "性能分析",
                description: "システムの性能評価と分析",
                icon: BarChart2,
                type: "性能"
              },
              {
                title: "コスト分析",
                description: "開発・運用コストの分析",
                icon: LineChart,
                type: "コスト"
              },
              {
                title: "リスク分析",
                description: "プロジェクトリスクの評価",
                icon: PieChart,
                type: "リスク"
              }
            ].map((analysis, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <analysis.icon className="mr-2 h-4 w-4" />
                    {analysis.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.description}</p>
                  <Badge variant="outline" className="mt-2">{analysis.type}</Badge>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">詳細</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>性能分析レポート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="分析を検索..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="分析タイプ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="response">応答時間</SelectItem>
                    <SelectItem value="throughput">スループット</SelectItem>
                    <SelectItem value="resource">リソース使用率</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>分析ID</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>更新日</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "PERF-001",
                      title: "システム応答時間分析",
                      type: "応答時間",
                      status: "完了",
                      date: "2024/05/01"
                    },
                    {
                      id: "PERF-002",
                      title: "スループット分析",
                      type: "スループット",
                      status: "進行中",
                      date: "2024/05/02"
                    }
                  ].map((analysis, i) => (
                    <TableRow key={i}>
                      <TableCell>{analysis.id}</TableCell>
                      <TableCell>{analysis.title}</TableCell>
                      <TableCell>{analysis.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={analysis.status === "完了" ? "default" : "secondary"}
                        >
                          {analysis.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{analysis.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">表示</Button>
                          <Button variant="outline" size="sm">編集</Button>
                          <Button variant="outline" size="sm">レポート</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>コスト分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "開発コスト",
                    description: "開発フェーズのコスト分析",
                    type: "開発"
                  },
                  {
                    title: "運用コスト",
                    description: "運用・保守コストの分析",
                    type: "運用"
                  },
                  {
                    title: "ROI分析",
                    description: "投資対効果の分析",
                    type: "ROI"
                  }
                ].map((cost, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LineChart className="mr-2 h-4 w-4" />
                        {cost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{cost.description}</p>
                      <Badge variant="outline" className="mt-2">{cost.type}</Badge>
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

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>リスク分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "技術リスク",
                    description: "技術的な課題とリスク",
                    type: "技術"
                  },
                  {
                    title: "スケジュールリスク",
                    description: "プロジェクトスケジュールのリスク",
                    type: "スケジュール"
                  },
                  {
                    title: "リソースリスク",
                    description: "リソース管理のリスク",
                    type: "リソース"
                  }
                ].map((risk, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="mr-2 h-4 w-4" />
                        {risk.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                      <Badge variant="outline" className="mt-2">{risk.type}</Badge>
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