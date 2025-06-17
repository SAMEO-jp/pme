"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Play, Pause, AlertTriangle, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type SequenceControlProps = {
  project: Project
  mockData?: any
}

export function SequenceControl({ project, mockData }: SequenceControlProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">シーケンス制御</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            シーケンス追加
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* 運転モード */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>運転モード</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              <Play className="h-4 w-4 mr-2 text-green-500" />
              自動運転
            </Button>
            <Button variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2 text-yellow-500" />
              手動運転
            </Button>
            <Button variant="outline" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              緊急停止
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* シーケンス一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>シーケンス一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
              <div>シーケンス名</div>
              <div>状態</div>
              <div>実行時間</div>
              <div>操作</div>
            </div>
            <div className="space-y-2">
              {[
                { name: "加熱炉起動シーケンス", status: "実行中", time: "15:30" },
                { name: "冷却水循環シーケンス", status: "待機中", time: "-" },
                { name: "ガス供給シーケンス", status: "完了", time: "14:45" },
                { name: "排ガス処理シーケンス", status: "待機中", time: "-" }
              ].map((seq, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-2 hover:bg-gray-50 rounded">
                  <div>{seq.name}</div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seq.status === "実行中" ? "bg-green-100 text-green-800" :
                      seq.status === "待機中" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {seq.status}
                    </span>
                  </div>
                  <div>{seq.time}</div>
                  <div>
                    <Button variant="outline" size="sm">詳細</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 連鎖条件 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>連鎖条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
              <div>条件名</div>
              <div>状態</div>
              <div>説明</div>
            </div>
            <div className="space-y-2">
              {[
                { name: "冷却水圧力", status: "正常", desc: "冷却水圧力が設定値以上" },
                { name: "ガス供給圧力", status: "警告", desc: "ガス供給圧力が低下" },
                { name: "排ガス温度", status: "正常", desc: "排ガス温度が許容範囲内" },
                { name: "安全インターロック", status: "正常", desc: "すべての安全装置が正常" }
              ].map((cond, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-2 hover:bg-gray-50 rounded">
                  <div>{cond.name}</div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      cond.status === "正常" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {cond.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{cond.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※シーケンスの変更は、必ず承認を得てから実施してください。</p>
        <p>※連鎖条件の変更は、安全確認の上で実施してください。</p>
      </div>
    </div>
  )
} 