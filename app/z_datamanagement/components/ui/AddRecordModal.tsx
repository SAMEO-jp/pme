import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ColumnConfig {
  columnName: string;
  displayName: string;
  isKey: boolean;
  columnType: string;
}

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  tableName: string;
  onSuccess: () => void;
}

export default function AddRecordModal({
  isOpen,
  onClose,
  columns,
  tableName,
  onSuccess
}: AddRecordModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (columnName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/z_datamanagement/table_data?table=${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('データの追加に失敗しました')
      }

      toast.success('データを追加しました')
      onSuccess()
      onClose()
      setFormData({})
    } catch (error) {
      console.error('データ追加エラー:', error)
      toast.error('データの追加に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新規データ追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {columns.map((column) => (
              <div key={column.columnName} className="space-y-2">
                <Label htmlFor={column.columnName}>
                  {column.displayName || column.columnName}
                  {column.isKey && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={column.columnName}
                  type={column.columnType?.toLowerCase().includes('date') ? 'date' : 'text'}
                  value={formData[column.columnName] || ''}
                  onChange={(e) => handleInputChange(column.columnName, e.target.value)}
                  required={column.isKey}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '追加中...' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 