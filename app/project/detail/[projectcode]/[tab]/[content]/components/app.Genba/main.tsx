"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type GenbaMainProps = {
  project: Project
  mockData: {
    fieldReports: {
      id: number
      date: string
      title: string
    }[]
  }
}

export function GenbaMain({ project, mockData }: GenbaMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">現場/出張管理</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          現場レポート追加
        </Button>
      </div>
      
      {/* レポート一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            現場レポート一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.fieldReports.map(report => (
              <div key={report.id} className="p-3 border rounded-md hover:shadow-md transition-all">
                <div className="text-sm text-gray-500">{report.date}</div>
                <div className="font-medium">{report.title}</div>
                <div className="flex mt-2 space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    詳細
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    編集
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 