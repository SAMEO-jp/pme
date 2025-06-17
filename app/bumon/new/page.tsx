"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/app/bumon/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/bumon/ui/tabs"

export default function NewDepartmentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // フォームデータの取得
    const formData = new FormData(event.currentTarget)
    const departmentData = {
      bumon_id: formData.get("bumon_id") as string,
      name: formData.get("name") as string,
      status: formData.get("status") as string,
      leader: formData.get("leader") as string,
      number: formData.get("number") as string,
      upstate: formData.get("upstate") as string,
      downstate: formData.get("downstate") as string,
      segment: formData.get("segment") as string,
      createday: formData.get("createday") as string,
      chagedday: formData.get("chagedday") as string,
      startday: formData.get("startday") as string,
      endday: formData.get("endday") as string,
      businesscode: formData.get("businesscode") as string,
      spare1: formData.get("spare1") as string,
      spare2: formData.get("spare2") as string,
      spare3: formData.get("spare3") as string,
      spare4: formData.get("spare4") as string,
      description: formData.get("description") as string,
    }

    try {
      // APIを呼び出して部門情報を保存
      const response = await fetch("/api/bumon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department: departmentData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "部門情報の登録に失敗しました")
      }

      // 成功メッセージ
      toast({
        title: "部門情報が登録されました",
        description: "部門情報の登録が完了しました。",
      })

      // 部門一覧ページにリダイレクト
      router.push("/bumon/list")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "エラーが発生しました",
        description:
          error instanceof Error ? error.message : "部門情報の登録中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">部門情報入力</h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>部門情報フォーム</CardTitle>
          <CardDescription>新しい部門情報を入力してください。</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Tabs defaultValue="basic" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="basic">基本情報</TabsTrigger>
                <TabsTrigger value="additional">追加情報</TabsTrigger>
                <TabsTrigger value="spare">予備項目</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bumon_id">部門ID</Label>
                    <Input id="bumon_id" name="bumon_id" placeholder="例: DEPT001" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">部門名</Label>
                    <Input id="name" name="name" placeholder="例: 営業部" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">ステータス</Label>
                    <Input id="status" name="status" placeholder="例: 有効" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leader">部門責任者</Label>
                    <Input id="leader" name="leader" placeholder="例: 山田太郎" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">番号</Label>
                    <Input id="number" name="number" placeholder="例: 001" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businesscode">ビジネスコード</Label>
                    <Input id="businesscode" name="businesscode" placeholder="例: BC001" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">部門説明</Label>
                  <Textarea id="description" name="description" placeholder="部門の説明を入力してください" rows={3} />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upstate">上位状態</Label>
                    <Input id="upstate" name="upstate" placeholder="例: 本部" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downstate">下位状態</Label>
                    <Input id="downstate" name="downstate" placeholder="例: チーム" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segment">セグメント</Label>
                    <Input id="segment" name="segment" placeholder="例: 営業" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="createday">作成日</Label>
                    <Input
                      id="createday"
                      name="createday"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chagedday">変更日</Label>
                    <Input
                      id="chagedday"
                      name="chagedday"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startday">開始日</Label>
                    <Input id="startday" name="startday" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endday">終了日</Label>
                    <Input id="endday" name="endday" type="date" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="spare" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spare1">予備項目1</Label>
                    <Input id="spare1" name="spare1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare2">予備項目2</Label>
                    <Input id="spare2" name="spare2" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare3">予備項目3</Label>
                    <Input id="spare3" name="spare3" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare4">予備項目4</Label>
                    <Input id="spare4" name="spare4" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/bumon/list")} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "登録中..." : "登録する"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
