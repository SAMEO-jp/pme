import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BumonHomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">部門情報管理システム</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>部門一覧</CardTitle>
            <CardDescription>登録されている部門の一覧を表示します。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bumon/list">
              <Button className="w-full">部門一覧ページへ</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>部門情報入力</CardTitle>
            <CardDescription>新しい部門情報の登録を行います。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bumon/new">
              <Button className="w-full" variant="outline">
                部門情報入力ページへ
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>履歴管理</CardTitle>
            <CardDescription>部門履歴と部門メンバー履歴の管理を行います。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bumon/history">
              <Button className="w-full" variant="outline">
                履歴管理ページへ
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>デバッグ</CardTitle>
            <CardDescription>データベース構造の確認などデバッグ機能を提供します。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bumon/debug">
              <Button className="w-full" variant="outline">
                デバッグページへ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
