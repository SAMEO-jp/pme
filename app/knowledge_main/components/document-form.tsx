"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDocument, getAllKnowledge } from "@/lib/knowledge_main/data"
import { useEffect } from "react"

interface DocumentFormProps {
  initialKnowledge?: string
}

export function DocumentForm({ initialKnowledge = "" }: DocumentFormProps) {
  const router = useRouter()
  const [knowledgeList, setKnowledgeList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    docuId: "",
    name: "",
    knowledgeType: initialKnowledge,
    documentType: "",
    departmentName: "",
    creationYear: new Date().getFullYear().toString(),
    creator: "",
    projectName: "",
    equipmentName: "",
    referenceId: "",
    storageLocation: "",
    storageId: "",
    level: "LEVEL1",
    likeCount: 0, // いいね数の初期値は0
    comment: "", // コメント欄を追加
  })

  useEffect(() => {
    const loadKnowledge = async () => {
      const knowledge = await getAllKnowledge()
      setKnowledgeList(knowledge)
    }

    loadKnowledge()
  }, [])

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
      alert("必須項目を入力してください")
      return
    }

    setIsLoading(true)
    try {
      await addDocument({
        ...formData,
        docuId: formData.docuId,
        likeCount: 0, // 新規作成時はいいね数を0に設定
      })
      router.push(`/knowledge/${encodeURIComponent(formData.knowledgeType)}`)
    } catch (error) {
      console.error("資料の追加に失敗しました", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="docuId">DocuID *</Label>
          <Input id="docuId" name="docuId" value={formData.docuId} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">資料名 *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="knowledgeType">ナレッジ種類 *</Label>
          <Select
            value={formData.knowledgeType}
            onValueChange={(value) => handleSelectChange("knowledgeType", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="ナレッジを選択" />
            </SelectTrigger>
            <SelectContent>
              {knowledgeList.map((knowledge) => (
                <SelectItem key={knowledge} value={knowledge}>
                  {knowledge}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">資料種類</Label>
          <Input id="documentType" name="documentType" value={formData.documentType} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentName">商品部名</Label>
          <Input id="departmentName" name="departmentName" value={formData.departmentName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creationYear">作成年</Label>
          <Input
            id="creationYear"
            name="creationYear"
            value={formData.creationYear}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creator">作成者</Label>
          <Input id="creator" name="creator" value={formData.creator} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName">プロジェクト名</Label>
          <Input id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipmentName">設備名</Label>
          <Input id="equipmentName" name="equipmentName" value={formData.equipmentName} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceId">参考資料ID</Label>
          <Input id="referenceId" name="referenceId" value={formData.referenceId} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageLocation">保存場所</Label>
          <Input id="storageLocation" name="storageLocation" value={formData.storageLocation} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageId">保存ID</Label>
          <Input id="storageId" name="storageId" value={formData.storageId} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">LEVEL</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger>
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
        <Label htmlFor="comment">コメント</Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="資料に関するコメントを入力してください"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Link href={formData.knowledgeType ? `/knowledge/${encodeURIComponent(formData.knowledgeType)}` : "/"} passHref>
          <Button variant="outline" type="button">
            キャンセル
          </Button>
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "保存中..." : "資料を保存"}
        </Button>
      </div>
    </form>
  )
}

