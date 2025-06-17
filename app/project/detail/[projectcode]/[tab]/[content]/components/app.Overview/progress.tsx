"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Project } from "@/lib/project/types"

type OverviewProgressProps = {
  project: Project;
  mockData: any;
}

export function OverviewProgress({ project, mockData }: OverviewProgressProps) {
  return (
    <div className="space-y-6">
      {/* 全体進捗 */}
      <Card>
        <CardHeader>
          <CardTitle>全体進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">進捗率</p>
                <p className="text-sm font-medium">{mockData.progressRate}%</p>
              </div>
              <Progress value={mockData.progressRate} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">契約状況</p>
                <p className="text-sm font-medium">{mockData.contractStatus}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タスク進捗 */}
      <Card>
        <CardHeader>
          <CardTitle>タスク進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.tasks.map((task: any) => (
              <div key={task.id} className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.status}</p>
                </div>
                <Progress value={task.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 現場報告 */}
      <Card>
        <CardHeader>
          <CardTitle>現場報告</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.fieldReports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-gray-500">{report.location}</p>
                </div>
                <p className="text-sm text-gray-500">{report.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 