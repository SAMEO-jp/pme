"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/bumon/ui/tabs"
import { DepartmentHistoryTable } from "@/app/bumon/components/department-history-table"
import { MemberHistoryTable } from "@/app/bumon/components/member-history-table"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("department")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">履歴管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>履歴データ</CardTitle>
          <CardDescription>部門履歴と部門メンバー履歴の情報を管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="department" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="department">部門履歴</TabsTrigger>
              <TabsTrigger value="member">部門メンバー履歴</TabsTrigger>
            </TabsList>
            <TabsContent value="department">
              <div className="flex justify-end mb-4">
                <Button>新規履歴追加</Button>
              </div>
              <DepartmentHistoryTable />
            </TabsContent>
            <TabsContent value="member">
              <div className="flex justify-end mb-4">
                <Button>新規メンバー履歴追加</Button>
              </div>
              <MemberHistoryTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
