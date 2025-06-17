"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project } from "@/lib/project/types"

type TasksDetailProps = {
  project: Project;
  mockData: any;
}

export function TasksDetail({ project, mockData }: TasksDetailProps) {
  return (
    <div className="space-y-6">
      {/* タスク詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>タスク詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">タスクID</label>
                <Input value="TASK-001" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">タイトル</label>
                <Input value="設計図面の作成" />
              </div>
              <div>
                <label className="text-sm font-medium">担当者</label>
                <Select defaultValue="user1">
                  <SelectTrigger>
                    <SelectValue placeholder="担当者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">山田太郎</SelectItem>
                    <SelectItem value="user2">鈴木花子</SelectItem>
                    <SelectItem value="user3">佐藤次郎</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">優先度</label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue placeholder="優先度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">期限</label>
                <Input type="date" value="2024-05-31" />
              </div>
              <div>
                <label className="text-sm font-medium">ステータス</label>
                <Select defaultValue="in_progress">
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">未着手</SelectItem>
                    <SelectItem value="in_progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium">説明</label>
            <Textarea
              placeholder="タスクの詳細な説明を入力してください"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* コメント */}
      <Card>
        <CardHeader>
          <CardTitle>コメント</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.taskComments?.map((comment: any) => (
              <div key={comment.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Textarea
              placeholder="コメントを入力してください"
              className="mb-2"
              rows={3}
            />
            <Button>コメントを投稿</Button>
          </div>
        </CardContent>
      </Card>

      {/* アクション */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">キャンセル</Button>
        <Button>保存</Button>
      </div>
    </div>
  )
} 