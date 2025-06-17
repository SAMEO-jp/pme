"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type TasksMainProps = {
  project: Project;
  mockData: {
    tasks: {
      id: number;
      name: string;
      dueDate: string;
    }[];
  };
}

export function TasksMain({ project, mockData }: TasksMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">タスク管理</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          タスク追加
        </Button>
      </div>
      
      {/* タスク一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-blue-500" />
            タスク一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.tasks.map(task => (
              <div key={task.id} className="p-3 border rounded-md hover:shadow-md transition-all">
                <div className="flex justify-between">
                  <div className="font-medium">{task.name}</div>
                  <Badge variant={parseInt(task.dueDate) <= 5 ? "destructive" : "outline"}>
                    納期：{task.dueDate}日
                  </Badge>
                </div>
                <div className="flex mt-2 space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    詳細
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    編集
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 