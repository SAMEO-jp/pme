"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusCircle, Mail, Phone } from "lucide-react"
import type { Project } from "@/lib/project/types"

type MembersMainProps = {
  project: Project
  mockData: {
    members: {
      id: number
      name: string
      role: string
      avatar: string
    }[]
  }
}

export function MembersMain({ project, mockData }: MembersMainProps) {
  // 役割カテゴリごとにメンバーを分類
  const memberCategories = [
    { title: "プロジェクト管理", members: mockData.members.filter(m => m.role === "プロマネ") },
    { title: "技術メンバー", members: mockData.members.filter(m => m.role === "エンジニア" || m.role === "設計") },
    { title: "現場担当", members: mockData.members.filter(m => m.role === "工事") },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクトメンバー</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          メンバー追加
        </Button>
      </div>

      {/* メンバーカテゴリ別グループ */}
      {memberCategories.map((category, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-semibold">{category.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.members.map(member => (
              <Card key={member.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      <AvatarFallback className="bg-gray-100 text-gray-800 text-xl">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-semibold">{member.name}</h4>
                      <p className="text-gray-500">{member.role}</p>
                      <div className="flex mt-2 space-x-3">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          メール
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          電話
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* 役割分担表 */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>役割分担表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">担当者</th>
                  <th className="px-4 py-3 text-left">役割</th>
                  <th className="px-4 py-3 text-left">主要タスク</th>
                  <th className="px-4 py-3 text-left">サポート担当</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">鈴木 一郎</td>
                  <td className="px-4 py-3">プロマネ</td>
                  <td className="px-4 py-3">全体進行管理、顧客折衝</td>
                  <td className="px-4 py-3">-</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">佐藤 二郎</td>
                  <td className="px-4 py-3">エンジニア</td>
                  <td className="px-4 py-3">電気設計、制御プログラム</td>
                  <td className="px-4 py-3">田中 三郎</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">田中 三郎</td>
                  <td className="px-4 py-3">設計</td>
                  <td className="px-4 py-3">機械設計、構造計算</td>
                  <td className="px-4 py-3">佐藤 二郎</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">高橋 四郎</td>
                  <td className="px-4 py-3">工事</td>
                  <td className="px-4 py-3">現場施工管理、安全管理</td>
                  <td className="px-4 py-3">鈴木 一郎</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※メンバー情報は社内規定に従い適切に取り扱ってください。</p>
        <p>※外部メンバーを追加する場合は、事前に管理者の承認が必要です。</p>
      </div>
    </div>
  )
} 