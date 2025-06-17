"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ThreeDMainProps = {
  project: Project
  mockData?: any
}

export function ThreeDMain({ project, mockData }: ThreeDMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">3Dモデル</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          3Dモデル追加
        </Button>
      </div>
      
      {/* 3Dモデル一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Box className="h-5 w-5 mr-2 text-blue-500" />
            3Dモデル一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left border-b">モデル名</th>
                  <th className="px-4 py-3 text-left border-b">作成日</th>
                  <th className="px-4 py-3 text-left border-b">作成者</th>
                  <th className="px-4 py-3 text-left border-b">ファイル形式</th>
                  <th className="px-4 py-3 text-left border-b">サイズ</th>
                  <th className="px-4 py-3 text-left border-b">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">全体アセンブリ</td>
                  <td className="px-4 py-3 border-b">2025/05/15</td>
                  <td className="px-4 py-3 border-b">田中 三郎</td>
                  <td className="px-4 py-3 border-b">STEP</td>
                  <td className="px-4 py-3 border-b">25.4 MB</td>
                  <td className="px-4 py-3 border-b">
                    <Button variant="outline" size="sm">表示</Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">機械部品A</td>
                  <td className="px-4 py-3 border-b">2025/05/18</td>
                  <td className="px-4 py-3 border-b">佐藤 二郎</td>
                  <td className="px-4 py-3 border-b">IGES</td>
                  <td className="px-4 py-3 border-b">12.7 MB</td>
                  <td className="px-4 py-3 border-b">
                    <Button variant="outline" size="sm">表示</Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">配管レイアウト</td>
                  <td className="px-4 py-3 border-b">2025/05/20</td>
                  <td className="px-4 py-3 border-b">高橋 四郎</td>
                  <td className="px-4 py-3 border-b">FBX</td>
                  <td className="px-4 py-3 border-b">18.2 MB</td>
                  <td className="px-4 py-3 border-b">
                    <Button variant="outline" size="sm">表示</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* 3Dビューア */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Box className="h-5 w-5 mr-2 text-green-500" />
            3Dビューア
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border border-gray-200 rounded-lg h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Box className="h-16 w-16 mx-auto mb-2 text-gray-400" />
              <p>3Dモデルを選択してください</p>
              <p className="text-sm mt-2">対応形式: STEP, IGES, STL, FBX, OBJ</p>
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