"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/project/types"

type DocumentsHistoryProps = {
  project: Project;
  mockData: any;
}

export function DocumentsHistory({ project, mockData }: DocumentsHistoryProps) {
  return (
    <div className="space-y-6">
      {/* バージョン履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>バージョン履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>バージョン</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead>更新者</TableHead>
                <TableHead>変更内容</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.documentHistory?.map((history: any) => (
                <TableRow key={history.id}>
                  <TableCell>{history.version}</TableCell>
                  <TableCell>{history.updatedAt}</TableCell>
                  <TableCell>{history.updatedBy}</TableCell>
                  <TableCell>{history.changes}</TableCell>
                  <TableCell>
                    <Badge variant={
                      history.status === "承認済み" ? "default" :
                      history.status === "レビュー中" ? "secondary" :
                      "destructive"
                    }>
                      {history.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* レビュー履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>レビュー履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.documentReviews?.map((review: any) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.reviewer}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      review.status === "承認" ? "default" :
                      review.status === "コメント" ? "secondary" :
                      "destructive"
                    }>
                      {review.status}
                    </Badge>
                    <span className="text-sm text-gray-500">v{review.version}</span>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* コメント履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>コメント履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.documentComments?.map((comment: any) => (
              <div key={comment.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  <span className="text-sm text-gray-500">v{comment.version}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 