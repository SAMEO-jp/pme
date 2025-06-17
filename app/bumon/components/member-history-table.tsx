"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/bumon/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useMemberHistory } from "@/lib/bumon/hooks"

export function MemberHistoryTable() {
  const { data, deleteMember, isLoading } = useMemberHistory()

  const handleEdit = (id: number) => {
    // 編集処理
    console.log(`Edit item with ID: ${id}`)
  }

  const handleDelete = async (id: number) => {
    // 削除処理
    if (confirm("このメンバー履歴を削除してもよろしいですか？")) {
      await deleteMember(id)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部門コード</TableHead>
            <TableHead>メンバー名</TableHead>
            <TableHead>役職</TableHead>
            <TableHead>配属日</TableHead>
            <TableHead>退職日</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                メンバー履歴データがありません
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.departmentCode}</TableCell>
                <TableCell>{item.memberName}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.joinDate}</TableCell>
                <TableCell>{item.leaveDate || "-"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
