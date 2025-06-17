"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDocument, deleteDocument } from "@/lib/knowledge_main/data"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/lib/knowledge_main/types"

interface DocumentEditFormProps {
  document: Document
  onSave: (updatedDoc: Document) => void
  onCancel: () => void
  onDelete?: () => void
}

export function DocumentEditForm({ document, onSave, onCancel, onDelete }: DocumentEditFormProps) {
  const [formData, setFormData] = useState<Document>({
    ...document,
    comment: document.comment || "", // コメントが未定義の場合は空文字列を設定
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.docuId || !formData.name || !formData.knowledgeType) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await addDocument(formData) // 既存のドキュメントは更新される
      toast({
        title: "保存完了",
        description: "資料が正常に更新されました",
      })
      onSave(formData)
    } catch (error) {
      console.error("資料の更新に失敗しました", error)
      toast({
        title: "更新失敗",
        description: "資料の更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("この資料を削除してもよろしいですか？この操作は元に戻せません。")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteDocument(document.docuId)
      toast({
        title: "削除完了",
        description: "資料が正常に削除されました",
      })
      if (onDelete) onDelete()
    } catch (error) {
      console.error("資料の削除に失敗しました", error)
      toast({
        title: "削除失敗",
        description: "資料の削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-docuId">DocuID *</Label>
          <Input
            id="edit-docuId"
            name="docuId"
            value={formData.docuId}
            onChange={handleChange}
            required
            disabled // DocuIDは編集不可
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-name">資料名 *</Label>
          <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-knowledgeType">ナレッジ種類 *</Label>
          <Input
            id="edit-knowledgeType"
            name="knowledgeType"
            value={formData.knowledgeType}
            onChange={handleChange}
            required
            disabled // ナレッジ種類は編集不可
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-documentType">資料種類</Label>
          <Input id="edit-documentType" name="documentType" value={formData.documentType} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-departmentName">商品部名</Label>
          <Input
            id="edit-departmentName"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-creationYear">作成年</Label>
          <Input
            id="edit-creationYear"
            name="creationYear"
            value={formData.creationYear}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-creator">作成者</Label>
          <Input id="edit-creator" name="creator" value={formData.creator} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-projectName">プロジェクト名</Label>
          <Input id="edit-projectName" name="projectName" value={formData.projectName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-equipmentName">設備名</Label>
          <Input id="edit-equipmentName" name="equipmentName" value={formData.equipmentName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-referenceId">参考資料ID</Label>
          <Input id="edit-referenceId" name="referenceId" value={formData.referenceId} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-storageLocation">保存場所</Label>
          <Input
            id="edit-storageLocation"
            name="storageLocation"
            value={formData.storageLocation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-storageId">保存ID</Label>
          <Input id="edit-storageId" name="storageId" value={formData.storageId} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-level">LEVEL</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger id="edit-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEVEL1">LEVEL1: 教科書・参考資料</SelectItem>
              <SelectItem value="LEVEL2">LEVEL2: 代表計算書</SelectItem>
              <SelectItem value="LEVEL3">LEVEL3: 過去実績資料</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* コメント欄を追加 */}
      <div className="space-y-2">
        <Label htmlFor="edit-comment">コメント</Label>
        <Textarea
          id="edit-comment"
          name="comment"
          value={formData.comment || ""}
          onChange={handleChange}
          placeholder="資料に関するコメントを入力してください"
          rows={4}
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "削除中..." : "資料を削除"}
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : "変更を保存"}
          </Button>
        </div>
      </div>
    </form>
  )
}

