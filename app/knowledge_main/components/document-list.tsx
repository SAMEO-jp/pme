"use client"

import { useEffect, useState } from "react"
import { Level1Documents } from "./level1-documents"
import { Level2Documents } from "./level2-documents"
import { Level3Documents } from "./level3-documents"
import { getDocumentsByKnowledgeAndLevel } from "@/lib/knowledge_main/data"
import type { Document } from "@/lib/knowledge_main/types"

interface DocumentListProps {
  knowledgeName: string
  level: string
}

export function DocumentList({ knowledgeName, level }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true)
      try {
        const docs = await getDocumentsByKnowledgeAndLevel(knowledgeName, level)
        setDocuments(docs)
      } catch (error) {
        console.error("資料の読み込みに失敗しました", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [knowledgeName, level])

  if (isLoading) {
    return <p>読み込み中...</p>
  }

  if (documents.length === 0) {
    return <p className="text-muted-foreground py-4">このレベルの資料はまだ登録されていません。</p>
  }

  // レベルに応じて異なるコンポーネントを表示
  switch (level) {
    case "LEVEL1":
      return <Level1Documents documents={documents} />
    case "LEVEL2":
      return <Level2Documents documents={documents} />
    case "LEVEL3":
      return <Level3Documents documents={documents} />
    default:
      return <p>不明なレベルです</p>
  }
}

