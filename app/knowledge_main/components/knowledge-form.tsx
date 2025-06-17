"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createKnowledge } from "@/lib/knowledge_main/data"

export function KnowledgeForm() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await createKnowledge(name)
      router.push(`/knowledge/${encodeURIComponent(name)}`)
    } catch (error) {
      console.error("ナレッジの作成に失敗しました", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="knowledge-name">ナレッジ名</Label>
        <Input
          id="knowledge-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：ねじ締結"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "作成中..." : "ナレッジページを作成"}
      </Button>
    </form>
  )
}

