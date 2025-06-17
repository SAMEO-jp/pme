"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Download, Share2, Trash2 } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ManufacturingDetailProps = {
  project: Project
  documentId: string
  mockData?: any
}

export function ManufacturingDetail({ project, documentId, mockData }: ManufacturingDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">製造資料詳細</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            共有
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            ダウンロード
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </Button>
        </div>
      </div>
      
      {/* 製造資料情報 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            製造資料情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">資料名</h3>
              <p className="mt-1">製造指示書</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">作成日</h3>
              <p className="mt-1">2025/05/15</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">作成者</h3>
              <p className="mt-1">佐藤 二郎</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ファイル形式</h3>
              <p className="mt-1">PDF</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ファイルサイズ</h3>
              <p className="mt-1">1.8 MB</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">承認済み</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 製造内容 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>製造内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">製造概要</h3>
              <p className="mt-1">既存設備の改修に伴う部品製造。主に配管系統の更新と制御盤の交換に必要な部品の製造を実施。</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">製造期間</h3>
              <p className="mt-1">2025/05/20 〜 2025/06/10</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">製造担当者</h3>
              <p className="mt-1">佐藤 二郎（製造責任者）</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※製造資料は社内規定に従い適切に取り扱ってください。</p>
        <p>※製造内容の変更がある場合は、必ず承認を得てから実施してください。</p>
      </div>
    </div>
  )
} 