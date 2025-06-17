"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/bumon/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useDepartmentHistory } from "@/lib/bumon/hooks"

export function DepartmentHistoryTable() {
  const { data, deleteHistory, isLoading } = useDepartmentHistory()

  const handleEdit = (id: number) => {
    // 編集処理
    console.log(`Edit item with ID: ${id}`)
  }

  const handleDelete = async (id: number) => {
    // 削除処理
    if (confirm("この履歴を削除してもよろしいですか？")) {
      await deleteHistory(id)
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
            <TableHead>部門名</TableHead>
            <TableHead>変更タイプ</TableHead>
            <TableHead>変更日</TableHead>
            <TableHead>変更者</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                履歴データがありません
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.bumon_id}</TableCell>
                <TableCell>{item.departmentName}</TableCell>
                <TableCell>{item.changeType}</TableCell>
                <TableCell>{item.change_date}</TableCell>
                <TableCell>{item.changedBy}</TableCell>
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
