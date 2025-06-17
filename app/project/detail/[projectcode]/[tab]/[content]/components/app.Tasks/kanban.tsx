"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Project } from "@/lib/project/types"

type TasksKanbanProps = {
  project: Project;
  mockData: any;
}

export function TasksKanban({ project, mockData }: TasksKanbanProps) {
  const columns = [
    { id: "not_started", title: "未着手" },
    { id: "in_progress", title: "進行中" },
    { id: "completed", title: "完了" },
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">カンバンボード</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規タスク
        </Button>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.tasks
                  ?.filter((task: any) => task.status === column.id)
                  .map((task: any) => (
                    <Card key={task.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant={task.priority === "高" ? "destructive" : "default"}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{task.assignee}</p>
                        <p className="text-sm text-gray-500">期限: {task.dueDate}</p>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>未完了タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockData.tasks?.filter((task: any) => task.status !== "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>期限切れタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {mockData.tasks?.filter((task: any) => task.isOverdue).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>完了率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Math.round(
                (mockData.tasks?.filter((task: any) => task.status === "completed").length /
                  mockData.tasks?.length) *
                  100
              )}
              %
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 