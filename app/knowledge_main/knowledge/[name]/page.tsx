import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DocumentList } from "@/app/knowledge_main/components/document-list"
import { KnowledgeDataManagement } from "@/app/knowledge_main/components/knowledge-data-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KnowledgeExistsCheck from "@/app/knowledge_main/components/knowledge-exists-check"

export default function KnowledgePage({
  params,
}: {
  params: { name: string }
}) {
  const decodedName = decodeURIComponent(params.name)

  return (
    <KnowledgeExistsCheck knowledgeName={decodedName}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">ナレッジ：{decodedName}</h1>
          <div className="flex gap-2">
            <Link href="/knowledge_main" passHref>
              <Button variant="outline">トップに戻る</Button>
            </Link>
            <Link href={`/knowledge_main/add-document?knowledge=${encodeURIComponent(decodedName)}`} passHref>
              <Button>資料を追加</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="level1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="level1">LEVEL1: 教科書・参考資料</TabsTrigger>
            <TabsTrigger value="level2">LEVEL2: 代表計算書</TabsTrigger>
            <TabsTrigger value="level3">LEVEL3: 過去実績資料</TabsTrigger>
            <TabsTrigger value="data-management">データ管理</TabsTrigger>
          </TabsList>
          <TabsContent value="level1" className="mt-4">
            <DocumentList knowledgeName={decodedName} level="LEVEL1" />
          </TabsContent>
          <TabsContent value="level2" className="mt-4">
            <DocumentList knowledgeName={decodedName} level="LEVEL2" />
          </TabsContent>
          <TabsContent value="level3" className="mt-4">
            <DocumentList knowledgeName={decodedName} level="LEVEL3" />
          </TabsContent>
          <TabsContent value="data-management" className="mt-4">
            <KnowledgeDataManagement knowledgeName={decodedName} />
          </TabsContent>
        </Tabs>
      </div>
    </KnowledgeExistsCheck>
  )
}

