"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/lib/project/types"

type OverviewSummaryProps = {
  project: Project;
  mockData: any;
}

export function OverviewSummary({ project, mockData }: OverviewSummaryProps) {
  return (
    <div className="space-y-6">
      {/* プロジェクト概要 */}
      <Card>
        <CardHeader>
          <CardTitle>プロジェクト概要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">概要</p>
              <p className="mt-1">{project.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">目的</p>
              <p className="mt-1">{project.objective}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">スコープ</p>
              <p className="mt-1">{project.scope}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要マイルストーン */}
      <Card>
        <CardHeader>
          <CardTitle>主要マイルストーン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.schedules.map((schedule: any) => (
              <div key={schedule.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{schedule.title}</p>
                  <p className="text-sm text-gray-500">{schedule.description}</p>
                </div>
                <p className="text-sm text-gray-500">{schedule.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最近の議事録 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の議事録</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.meetings.map((meeting: any) => (
              <div key={meeting.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-gray-500">{meeting.summary}</p>
                </div>
                <p className="text-sm text-gray-500">{meeting.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 