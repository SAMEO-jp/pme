import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function PersonProjects({ params }: { params: { person: string } }) {
  const person = decodeURIComponent(params.person)

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{person}担当のプロジェクト</h1>
        <div className="flex gap-2">
          <Link href="/project/projectlist/all">
            <Button variant="outline">全プロジェクト</Button>
          </Link>
          <Link href="/project/home">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Construction className="h-12 w-12 text-muted-foreground" />
        </CardHeader>
        <CardContent className="text-center py-8">
          <CardTitle className="text-xl mb-4">開発中</CardTitle>
          <p className="text-muted-foreground mb-6">
            ユーザーとプロジェクトの関連付けデータベースを構築中です。
            <br />
            この機能は近日公開予定です。
          </p>
          <Link href="/project/projectlist/all">
            <Button>全プロジェクト一覧へ</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
