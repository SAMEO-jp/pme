import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KnowledgeForm } from "@/app/knowledge_main/components/knowledge-form"

export default function CreateKnowledgePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">新規ナレッジ作成</h1>
        <Link href="/" passHref>
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <KnowledgeForm />
      </div>
    </div>
  )
}

