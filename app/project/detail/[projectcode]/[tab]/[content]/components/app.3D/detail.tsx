"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Download, Share2, Trash2 } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ThreeDDetailProps = {
  project: Project
  modelId: string
  mockData?: any
}

export function ThreeDDetail({ project, modelId, mockData }: ThreeDDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">3Dモデル詳細</h2>
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
      
      {/* 3Dビューア */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Box className="h-5 w-5 mr-2 text-blue-500" />
            3Dビューア
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border border-gray-200 rounded-lg h-[500px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Box className="h-16 w-16 mx-auto mb-2 text-gray-400" />
              <p>3Dモデルを読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* モデル情報 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>モデル情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">モデル名</h3>
              <p className="mt-1">全体アセンブリ</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">作成日</h3>
              <p className="mt-1">2025/05/15</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">作成者</h3>
              <p className="mt-1">田中 三郎</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ファイル形式</h3>
              <p className="mt-1">STEP</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ファイルサイズ</h3>
              <p className="mt-1">25.4 MB</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">バージョン</h3>
              <p className="mt-1">1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※3Dモデルの表示には対応ブラウザが必要です。</p>
        <p>※大きなモデルファイルはロードに時間がかかる場合があります。</p>
      </div>
    </div>
  )
} 