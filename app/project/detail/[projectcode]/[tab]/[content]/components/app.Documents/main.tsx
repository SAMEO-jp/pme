"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/project/types"

type DocumentsMainProps = {
  project: Project;
  mockData: any;
}

export function DocumentsMain({ project, mockData }: DocumentsMainProps) {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">文書管理</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            アップロード
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規文書
          </Button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="文書を検索..." className="pl-8" />
          </div>
        </div>
      </div>

      {/* 文書一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>文書一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文書ID</TableHead>
                <TableHead>タイトル</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>バージョン</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead>更新者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.documents?.map((document: any) => (
                <TableRow key={document.id}>
                  <TableCell>{document.id}</TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>{document.category}</TableCell>
                  <TableCell>{document.version}</TableCell>
                  <TableCell>{document.updatedAt}</TableCell>
                  <TableCell>{document.updatedBy}</TableCell>
                  <TableCell>
                    <Badge variant={
                      document.status === "承認済み" ? "default" :
                      document.status === "レビュー中" ? "secondary" :
                      "destructive"
                    }>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>総文書数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockData.documents?.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>レビュー中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockData.documents?.filter((doc: any) => doc.status === "レビュー中").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>承認済み</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockData.documents?.filter((doc: any) => doc.status === "承認済み").length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 