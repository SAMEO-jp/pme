import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KnowledgeList } from "@/app/knowledge_main/components/knowledge-list"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ナレッジ整理システム</h1>

      <div className="flex justify-end mb-6">
        <Link href="/knowledge_main/create-knowledge">
          <Button>新規ナレッジ作成</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">ナレッジ一覧</h2>
        <KnowledgeList />
      </div>
    </div>
  )
}

