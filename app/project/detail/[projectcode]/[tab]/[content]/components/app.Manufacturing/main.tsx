"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ManufacturingMainProps = {
  project: Project
  mockData?: any
}

export function ManufacturingMain({ project, mockData }: ManufacturingMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">製造管理</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          製造資料追加
        </Button>
      </div>
      
      {/* 製造資料一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            製造資料一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            準備中です...
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 