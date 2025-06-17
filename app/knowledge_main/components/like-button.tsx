"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateLikeCount } from "@/lib/knowledge_main/data"
import { useToast } from "@/hooks/use-toast"

interface LikeButtonProps {
  docuId: string
  initialLikeCount: number
  onLikeUpdate?: (newCount: number) => void
}

export function LikeButton({ docuId, initialLikeCount, onLikeUpdate }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    setIsLoading(true)
    try {
      const updatedDoc = await updateLikeCount(docuId, true)
      if (updatedDoc) {
        setLikeCount(updatedDoc.likeCount)
        if (onLikeUpdate) {
          onLikeUpdate(updatedDoc.likeCount)
        }
      }
    } catch (error) {
      console.error("いいねの更新に失敗しました", error)
      toast({
        title: "エラー",
        description: "いいねの更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleLike} disabled={isLoading}>
      <ThumbsUp className="h-4 w-4" />
      <span>{likeCount}</span>
    </Button>
  )
}

