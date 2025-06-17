"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getKnowledgeByName } from "@/lib/knowledge_main/data"
import { Skeleton } from "@/components/ui/skeleton"

interface KnowledgeExistsCheckProps {
  knowledgeName: string
  children: ReactNode
}

export default function KnowledgeExistsCheck({ knowledgeName, children }: KnowledgeExistsCheckProps) {
  const [exists, setExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkKnowledge = async () => {
      try {
        const exists = await getKnowledgeByName(knowledgeName)
        setExists(exists)
        setLoading(false)
        
        if (!exists) {
          router.push("/not-found")
        }
      } catch (error) {
        console.error("ナレッジの確認中にエラーが発生しました", error)
        setLoading(false)
        setExists(false)
        router.push("/not-found")
      }
    }

    checkKnowledge()
  }, [knowledgeName, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-2/3 mb-8" />
        <Skeleton className="h-24 w-full mb-4" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!exists) {
    return null
  }

  return <>{children}</>
} 