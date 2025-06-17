"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/app/bumon/ui/textarea"
import { toast } from "@/hooks/use-toast"
import type { Department } from "@/lib/bumon/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/bumon/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [department, setDepartment] = useState<Department | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchDepartment() {
      try {
        setIsFetching(true)
        // APIから部門情報を取得
        const response = await fetch(`/api/bumon/${params.id}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.department) {
          setDepartment(data.department)
        } else {
          toast({
            title: "部門が見つかりません",
            description: "指定された部門IDは存在しません。",
            variant: "destructive",
          })
          router.push("/bumon/list")
        }
      } catch (error) {
        console.error("部門情報の取得に失敗しました:", error)
        toast({
          title: "エラーが発生しました",
          description: "部門情報の取得中にエラーが発生しました。",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchDepartment()
  }, [params.id, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // フォームデータの取得
    const formData = new FormData(event.currentTarget)
    const departmentData = {
      id: department?.id,
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
      // APIを呼び出して部門情報を更新
      const response = await fetch(`/api/bumon/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department: departmentData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "部門情報の更新に失敗しました")
      }

      // 成功メッセージ
      toast({
        title: "部門情報が更新されました",
        description: "部門情報の更新が完了しました。",
      })

      // 部門一覧ページにリダイレクト
      router.push("/bumon/list")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "エラーが発生しました",
        description:
          error instanceof Error ? error.message : "部門情報の更新中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bumon/${params.id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      toast({
        title: "部門が削除されました",
        description: "部門の削除が完了しました。",
      })

      // 部門一覧ページにリダイレクト
      router.push("/bumon/list")
    } catch (error) {
      console.error("部門の削除に失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "部門の削除中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p>部門情報が見つかりませんでした。</p>
              <Button className="mt-4" onClick={() => router.push("/bumon/list")}>
                部門一覧に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">部門情報編集</h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>部門情報フォーム</CardTitle>
          <CardDescription>部門情報を編集してください。</CardDescription>
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
                    <Input
                      id="bumon_id"
                      name="bumon_id"
                      defaultValue={department.bumon_id}
                      placeholder="例: DEPT001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">部門名</Label>
                    <Input id="name" name="name" defaultValue={department.name} placeholder="例: 営業部" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">ステータス</Label>
                    <Input id="status" name="status" defaultValue={department.status} placeholder="例: 有効" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leader">部門責任者</Label>
                    <Input id="leader" name="leader" defaultValue={department.leader} placeholder="例: 山田太郎" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">番号</Label>
                    <Input id="number" name="number" defaultValue={department.number} placeholder="例: 001" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businesscode">ビジネスコード</Label>
                    <Input
                      id="businesscode"
                      name="businesscode"
                      defaultValue={department.businesscode}
                      placeholder="例: BC001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">部門説明</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={department.description}
                    placeholder="部門の説明を入力してください"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upstate">上位状態</Label>
                    <Input id="upstate" name="upstate" defaultValue={department.upstate} placeholder="例: 本部" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downstate">下位状態</Label>
                    <Input
                      id="downstate"
                      name="downstate"
                      defaultValue={department.downstate}
                      placeholder="例: チーム"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segment">セグメント</Label>
                    <Input id="segment" name="segment" defaultValue={department.segment} placeholder="例: 営業" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="createday">作成日</Label>
                    <Input id="createday" name="createday" type="date" defaultValue={department.createday} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chagedday">変更日</Label>
                    <Input
                      id="chagedday"
                      name="chagedday"
                      type="date"
                      defaultValue={department.chagedday || new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startday">開始日</Label>
                    <Input id="startday" name="startday" type="date" defaultValue={department.startday} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endday">終了日</Label>
                    <Input id="endday" name="endday" type="date" defaultValue={department.endday} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="spare" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spare1">予備項目1</Label>
                    <Input id="spare1" name="spare1" defaultValue={department.spare1} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare2">予備項目2</Label>
                    <Input id="spare2" name="spare2" defaultValue={department.spare2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare3">予備項目3</Label>
                    <Input id="spare3" name="spare3" defaultValue={department.spare3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spare4">予備項目4</Label>
                    <Input id="spare4" name="spare4" defaultValue={department.spare4} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/bumon/list")} disabled={isLoading}>
                キャンセル
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isLoading}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "更新中..." : "更新する"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>部門の削除</DialogTitle>
            <DialogDescription>
              部門「{department?.name}」を削除してもよろしいですか？この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
