import { Card, CardContent } from "@/components/ui/card"
import type { Department } from "@/lib/bumon/types"

interface DepartmentInfoProps {
  department: Department
}

export function DepartmentInfo({ department }: DepartmentInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">部門ID</p>
              <p>{department.bumon_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">部門名</p>
              <p>{department.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ステータス</p>
              <p>{department.status || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">部門責任者</p>
              <p>{department.leader || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">番号</p>
              <p>{department.number || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ビジネスコード</p>
              <p>{department.businesscode || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">部門説明</p>
            <p className="whitespace-pre-wrap">{department.description || "説明はありません"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">上位状態</p>
              <p>{department.upstate || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">下位状態</p>
              <p>{department.downstate || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">セグメント</p>
              <p>{department.segment || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">作成日</p>
              <p>{department.createday || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">変更日</p>
              <p>{department.chagedday || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">開始日</p>
              <p>{department.startday || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">終了日</p>
              <p>{department.endday || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
