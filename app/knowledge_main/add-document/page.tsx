import { DocumentForm } from "@/app/knowledge_main/components/document-form"

export default function AddDocumentPage({
  searchParams,
}: {
  searchParams: { knowledge?: string }
}) {
  const knowledgeName = searchParams.knowledge ? decodeURIComponent(searchParams.knowledge) : ""

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">資料追加</h1>
      <DocumentForm initialKnowledge={knowledgeName} />
    </div>
  )
}

