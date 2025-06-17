"use client"

import { useState } from "react"
import { Search, Pencil } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Document } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LikeButton } from "./like-button"
import { DocumentEditForm } from "./document-edit-form"

interface Level3DocumentsProps {
  documents: Document[]
}

export function Level3Documents({ documents }: Level3DocumentsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [sortField, setSortField] = useState<keyof Document>("creationYear")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
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

  // 検索とソート
  const filteredDocuments = documentsList
    .filter((doc) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        doc.name.toLowerCase().includes(searchLower) ||
        doc.docuId.toLowerCase().includes(searchLower) ||
        doc.creator?.toLowerCase().includes(searchLower) ||
        doc.projectName?.toLowerCase().includes(searchLower) ||
        doc.documentType?.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (sortField === "likeCount") {
        return sortDirection === "asc" ? a.likeCount - b.likeCount : b.likeCount - a.likeCount
      }

      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // ソートの切り替え
  const toggleSort = (field: keyof Document) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="資料名、DocuID、作成者などで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">並び替え:</span>
          <Select value={sortField} onValueChange={(value) => setSortField(value as keyof Document)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="likeCount">いいね数</SelectItem>
              <SelectItem value="creationYear">作成年</SelectItem>
              <SelectItem value="name">資料名</SelectItem>
              <SelectItem value="docuId">DocuID</SelectItem>
              <SelectItem value="creator">作成者</SelectItem>
              <SelectItem value="documentType">資料種類</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("docuId")}>
                DocuID {sortField === "docuId" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                資料名 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => toggleSort("documentType")}>
                資料種類 {sortField === "documentType" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => toggleSort("creationYear")}>
                作成年 {sortField === "creationYear" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => toggleSort("creator")}>
                作成者 {sortField === "creator" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("likeCount")}>
                いいね {sortField === "likeCount" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  検索条件に一致する資料はありません
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.docuId}>
                  <TableCell>{doc.docuId}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{doc.documentType || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{doc.creationYear || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{doc.creator || "-"}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
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
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

