"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type RelatedMainProps = {
  project: Project
  mockData?: any
}

export function RelatedMain({ project, mockData }: RelatedMainProps) {
  // 関連プロジェクトのダミーデータ
  const relatedProjects = [
    { id: 1, code: "EBXX0025001", name: "前段設備改修", relation: "先行", status: "完了" },
    { id: 2, code: "EBXX0025003", name: "後工程設備導入", relation: "後続", status: "計画中" },
    { id: 3, code: "EBXX0025004", name: "保守契約", relation: "関連", status: "進行中" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">関連プロジェクト</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          関連付け追加
        </Button>
      </div>
      
      {/* 関連プロジェクト一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Link className="h-5 w-5 mr-2 text-blue-500" />
            関連プロジェクト一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left border-b">プロジェクトコード</th>
                  <th className="px-4 py-3 text-left border-b">プロジェクト名</th>
                  <th className="px-4 py-3 text-left border-b">関連タイプ</th>
                  <th className="px-4 py-3 text-left border-b">ステータス</th>
                  <th className="px-4 py-3 text-left border-b">アクション</th>
                </tr>
              </thead>
              <tbody>
                {relatedProjects.map(proj => (
                  <tr key={proj.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{proj.code}</td>
                    <td className="px-4 py-3 border-b">{proj.name}</td>
                    <td className="px-4 py-3 border-b">{proj.relation}</td>
                    <td className="px-4 py-3 border-b">{proj.status}</td>
                    <td className="px-4 py-3 border-b">
                      <Button variant="outline" size="sm">詳細表示</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 