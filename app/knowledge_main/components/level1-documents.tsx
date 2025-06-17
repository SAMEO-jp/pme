"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Document } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LikeButton } from "./like-button"
import { DocumentEditForm } from "./document-edit-form"
import { Pencil, MessageSquare } from "lucide-react"

interface Level1DocumentsProps {
  documents: Document[]
}

export function Level1Documents({ documents }: Level1DocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documentsList, setDocumentsList] = useState<Document[]>(documents)
  const [isEditMode, setIsEditMode] = useState(false)

  // 表示する資料は最大6つまで（いいね数順）
  const displayDocuments = [...documentsList].sort((a, b) => b.likeCount - a.likeCount).slice(0, 6)

  // 残りの資料
  const remainingDocuments =
    documentsList.length > 6
      ? documentsList.filter((doc) => !displayDocuments.some((d) => d.docuId === doc.docuId))
      : []

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

  // コメントの有無を示すアイコンを表示
  const CommentIcon = ({ doc }: { doc: Document }) => {
    if (!doc.comment) return null
    return <MessageSquare className="h-4 w-4 text-muted-foreground" title={doc.comment} />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayDocuments.map((doc) => (
          <Card key={doc.docuId} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <CardTitle className="text-lg truncate">{doc.name}</CardTitle>
                    <CommentIcon doc={doc} />
                  </div>
                  <CardDescription>ID: {doc.docuId}</CardDescription>
                </div>
                <LikeButton
                  docuId={doc.docuId}
                  initialLikeCount={doc.likeCount}
                  onLikeUpdate={(newCount) => handleLikeUpdate(doc.docuId, newCount)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-48 bg-muted">
                <Image
                  src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(doc.name)}`}
                  alt={doc.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2">
              <Button variant="outline" className="w-full" onClick={() => setSelectedDocument(doc)}>
                詳細を見る
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 資料詳細ダイアログ */}
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedDocument.name}</span>
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
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">詳細情報</TabsTrigger>
                  <TabsTrigger value="preview">プレビュー</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <p className="text-sm font-medium">DocuID</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.docuId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">資料名</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ナレッジ種類</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.knowledgeType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">資料種類</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.documentType || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">商品部名</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.departmentName || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">作成年</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.creationYear || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">作成者</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.creator || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">プロジェクト名</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.projectName || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">設備名</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.equipmentName || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">参考資料ID</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.referenceId || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">保存場所</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.storageLocation || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">保存ID</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.storageId || "未設定"}</p>
                    </div>
                  </div>

                  {/* コメント欄を追加 */}
                  {selectedDocument.comment && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">コメント</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedDocument.comment}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview">
                  <div className="flex justify-center py-4">
                    <div className="relative h-[400px] w-full max-w-[600px] bg-muted">
                      <Image
                        src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(selectedDocument.name)}`}
                        alt={selectedDocument.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* 残りの資料を表で表示 */}
      {remainingDocuments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">その他の資料</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DocuID</TableHead>
                  <TableHead>資料名</TableHead>
                  <TableHead className="hidden md:table-cell">資料種類</TableHead>
                  <TableHead className="hidden md:table-cell">作成年</TableHead>
                  <TableHead className="hidden md:table-cell">作成者</TableHead>
                  <TableHead>いいね</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remainingDocuments.map((doc) => (
                  <TableRow key={doc.docuId}>
                    <TableCell>{doc.docuId}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {doc.name}
                      <CommentIcon doc={doc} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doc.documentType}</TableCell>
                    <TableCell className="hidden md:table-cell">{doc.creationYear}</TableCell>
                    <TableCell className="hidden md:table-cell">{doc.creator}</TableCell>
                    <TableCell>
                      <LikeButton
                        docuId={doc.docuId}
                        initialLikeCount={doc.likeCount}
                        onLikeUpdate={(newCount) => handleLikeUpdate(doc.docuId, newCount)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(doc)}>
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

