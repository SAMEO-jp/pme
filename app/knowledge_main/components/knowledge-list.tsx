"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllKnowledge } from "@/lib/knowledge_main/data"

export function KnowledgeList() {
  const [knowledgeList, setKnowledgeList] = useState<string[]>([])

  useEffect(() => {
    const loadKnowledge = async () => {
      const knowledge = await getAllKnowledge()
      setKnowledgeList(knowledge)
    }

    loadKnowledge()
  }, [])

  if (knowledgeList.length === 0) {
    return <p className="text-muted-foreground">ナレッジがまだ登録されていません。</p>
  }

  return (
    <ul className="space-y-2">
      {knowledgeList.map((name) => (
        <li key={name}>
          <Link href={`/knowledge_main/knowledge/${encodeURIComponent(name)}`} passHref>
            <Button variant="outline" className="w-full justify-start">
              {name}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  )
}

