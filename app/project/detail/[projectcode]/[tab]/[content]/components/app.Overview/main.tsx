"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  FileIcon, UsersIcon, Wrench, FileText, BarChart3, Building, TrendingUp
} from "lucide-react"
import type { Project } from "@/lib/project/types"

type MockData = {
  members: {
    id: number
    name: string
    role: string
    avatar: string
  }[]
  schedules: {
    id: number
    date: string
    title: string
  }[]
  meetings: {
    id: number
    date: string
    title: string
  }[]
  tasks: {
    id: number
    name: string
    dueDate: string
  }[]
  fieldReports: {
    id: number
    date: string
    title: string
  }[]
  progressRate: number
  contractStatus: {
    signed: number
    pending: number
    negotiation: number
  }
}

type OverviewMainProps = {
  project: Project
  mockData: MockData
}

export function OverviewMain({ project, mockData }: OverviewMainProps) {
  return (
    <>
      {/* クイックリンク */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Link href="#" className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <FileIcon className="h-10 w-10 text-red-500 mr-4" />
          <div>
            <h3 className="font-semibold">プロジェクト運営資料</h3>
            <p className="text-sm text-gray-500">各種プロジェクト管理ドキュメント</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <Building className="h-10 w-10 text-blue-500 mr-4" />
          <div>
            <h3 className="font-semibold">関連プロジェクト</h3>
            <p className="text-sm text-gray-500">連携する他プロジェクト情報</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <UsersIcon className="h-10 w-10 text-green-500 mr-4" />
          <div>
            <h3 className="font-semibold">参加メンバー</h3>
            <p className="text-sm text-gray-500">メンバーリストと連絡先</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <Wrench className="h-10 w-10 text-amber-500 mr-4" />
          <div>
            <h3 className="font-semibold">工事資料</h3>
            <p className="text-sm text-gray-500">工事関連ドキュメント</p>
          </div>
        </Link>
      </div>

      {/* 情報リスト行 */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* 参加メンバー一覧 */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
              参加メンバー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.members.map(member => (
                <div key={member.id} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
              </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全員表示
              </Button>
              </div>
          </CardContent>
        </Card>

        {/* 予定表リスト */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-500" />
              予定表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.schedules.map(schedule => (
                <div key={schedule.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-500 w-24">{schedule.date}</div>
                  <div className="text-sm">{schedule.title}</div>
              </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全予定表示
              </Button>
              </div>
          </CardContent>
        </Card>

        {/* 議事録リスト */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              議事録
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.meetings.map(meeting => (
                <div key={meeting.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-500 w-24">{meeting.date}</div>
                  <div className="text-sm">{meeting.title}</div>
              </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全議事録表示
              </Button>
              </div>
          </CardContent>
        </Card>

        {/* タスク管理 */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
              タスク管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                  <div className="text-sm">{task.name}</div>
                  <Badge variant={parseInt(task.dueDate) <= 5 ? "destructive" : "outline"}>
                    納期：{task.dueDate}日
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全タスク表示
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ダッシュボード行 */}
      <div className="grid grid-cols-3 gap-6">
        {/* プロジェクト進捗率 */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              プロジェクト進捗率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-red-600 mb-4">
                {mockData.progressRate}%
              </div>
              <Progress 
                value={mockData.progressRate} 
                className="w-full h-4 mb-2"
              />
              <div className="grid grid-cols-4 w-full text-center text-xs mt-2">
                <div>計画</div>
                <div>設計</div>
                <div>製造</div>
                <div>完了</div>
              </div>
              </div>
          </CardContent>
        </Card>

        {/* 契約状況サマリー */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              契約状況サマリー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-green-500">
                  {mockData.contractStatus.signed}
                </div>
                <div className="text-sm">締結済</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-amber-500">
                  {mockData.contractStatus.pending}
                </div>
                <div className="text-sm">審査中</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-500">
                  {mockData.contractStatus.negotiation}
                </div>
                <div className="text-sm">交渉中</div>
              </div>
              </div>
          </CardContent>
        </Card>

        {/* 現場／出張レポート */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building className="h-5 w-5 mr-2 text-amber-500" />
              現場／出張レポート
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.fieldReports.map(report => (
                <div key={report.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-500 w-24">{report.date}</div>
                  <div className="text-sm">{report.title}</div>
              </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全レポート表示
              </Button>
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 