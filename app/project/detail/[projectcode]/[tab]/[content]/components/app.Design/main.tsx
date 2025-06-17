"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type DesignMainProps = {
  project: Project
  mockData?: any
}

export function DesignMain({ project, mockData }: DesignMainProps) {
  return (
    <div className="space-y-6">
      {/* KPIカード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">基本設計進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">詳細設計進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">レビュー待ち</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12件</div>
            <div className="text-xs text-muted-foreground mt-1">3件が緊急</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">設計変更</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8件</div>
            <div className="text-xs text-muted-foreground mt-1">今月の累計</div>
          </CardContent>
        </Card>
      </div>

      {/* 最近の更新とレビュー待ち */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近の更新</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">基本設計書_第{i}章</div>
                    <div className="text-sm text-muted-foreground">更新: 2024/05/0{i}</div>
                  </div>
                  <Badge variant="outline">v1.{i}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>レビュー待ち項目</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">詳細設計書_第{i}章</div>
                    <div className="text-sm text-muted-foreground">提出: 2024/05/0{i}</div>
                  </div>
                  <Badge variant={i === 1 ? "destructive" : "outline"}>
                    {i === 1 ? "緊急" : "通常"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* マイルストーン */}
      <Card>
        <CardHeader>
          <CardTitle>設計マイルストーン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "基本設計完了", date: "2024/06/30", status: "pending" },
              { title: "詳細設計開始", date: "2024/07/01", status: "pending" },
              { title: "詳細設計完了", date: "2024/09/30", status: "pending" },
              { title: "設計レビュー完了", date: "2024/10/15", status: "pending" }
            ].map((milestone, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-muted-foreground">期限: {milestone.date}</div>
                </div>
                <Badge variant="outline">{milestone.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 