"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Document } from "@/lib/types"
import { LikeButton } from "./like-button"
import { DocumentEditForm } from "./document-edit-form"
import { Pencil } from "lucide-react"

interface Level2DocumentsProps {
  documents: Document[]
}

export function Level2Documents({ documents }: Level2DocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documentsList, setDocumentsList] = useState<Document[]>(documents)
  const [isEditMode, setIsEditMode] = useState(false)

  // いいね数が更新されたときの処理
  const handleLikeUpdate = (docuId: string, newCount: number) => {
    setDocumentsList((prev) => prev.map((doc) => (doc.docuId === docuId ? { ...doc, likeCount: newCount } : doc)))
  }

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  // 編集内容の保存
  const handleSaveEdit = (updatedDoc: Document) => {
    setDocumentsList((prev) => prev.map((doc) => (doc.docuId === updatedDoc.docuId ? updatedDoc : doc)))
    setSelectedDocument(updatedDoc)
    setIsEditMode(false)
  }

  // 編集のキャンセル
  const handleCancelEdit = () => {
    setIsEditMode(false)
  }

  // 資料の削除
  const handleDeleteDocument = () => {
    if (selectedDocument) {
      setDocumentsList((prev) => prev.filter((doc) => doc.docuId !== selectedDocument.docuId))
      setSelectedDocument(null)
    }
  }

  // 部門ごとにドキュメントをグループ化
  const documentsByDepartment = useMemo(() => {
    const grouped: Record<string, Document[]> = {}

    documentsList.forEach((doc) => {
      const department = doc.departmentName || "未分類"
      if (!grouped[department]) {
        grouped[department] = []
      }
      grouped[department].push(doc)
    })

    // 各部門内でいいね数順にソート
    Object.keys(grouped).forEach((dept) => {
      grouped[dept].sort((a, b) => b.likeCount - a.likeCount)
    })

    return grouped
  }, [documentsList])

  // 部門の配列を取得
  const departments = Object.keys(documentsByDepartment)

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {departments.map((department, index) => (
          <AccordionItem key={department} value={`department-${index}`}>
            <AccordionTrigger className="text-lg font-medium">
              {department} ({documentsByDepartment[department].length}件)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {documentsByDepartment[department].map((doc) => (
                  <Card key={doc.docuId}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                        <LikeButton
                          docuId={doc.docuId}
                          initialLikeCount={doc.likeCount}
                          onLikeUpdate={(newCount) => handleLikeUpdate(doc.docuId, newCount)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground">
                        <p>DocuID: {doc.docuId}</p>
                        <p>作成者: {doc.creator || "未設定"}</p>
                        <p>作成年: {doc.creationYear || "未設定"}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedDocument(doc)}>
                        計算書を表示
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 計算書詳細ダイアログ */}
      {selectedDocument && (
        <Dialog
          open={!!selectedDocument}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedDocument(null)
              setIsEditMode(false)
            }
          }}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  {selectedDocument.name} {!isEditMode && "- 計算書"}
                </span>
                <div className="flex items-center gap-2">
                  {!isEditMode && (
                    <>
                      <LikeButton
                        docuId={selectedDocument.docuId}
                        initialLikeCount={selectedDocument.likeCount}
                        onLikeUpdate={(newCount) => handleLikeUpdate(selectedDocument.docuId, newCount)}
                      />
                      <Button variant="outline" size="sm" onClick={toggleEditMode}>
                        <Pencil className="h-4 w-4 mr-1" /> 編集
                      </Button>
                    </>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            {isEditMode ? (
              <DocumentEditForm
                document={selectedDocument}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteDocument}
              />
            ) : (
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">DocuID:</span> {selectedDocument.docuId}
                  </div>
                  <div>
                    <span className="font-medium">作成者:</span> {selectedDocument.creator || "未設定"}
                  </div>
                  <div>
                    <span className="font-medium">作成年:</span> {selectedDocument.creationYear || "未設定"}
                  </div>
                </div>

                <div className="relative h-[600px] w-full bg-muted rounded-md overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(
                      selectedDocument.name + " - 計算書",
                    )}`}
                    alt={`${selectedDocument.name} 計算書`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">プロジェクト名:</span> {selectedDocument.projectName || "未設定"}
                  </p>
                  <p>
                    <span className="font-medium">設備名:</span> {selectedDocument.equipmentName || "未設定"}
                  </p>
                  <p>
                    <span className="font-medium">参考資料ID:</span> {selectedDocument.referenceId || "未設定"}
                  </p>
                  <p>
                    <span className="font-medium">保存場所:</span> {selectedDocument.storageLocation || "未設定"}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

