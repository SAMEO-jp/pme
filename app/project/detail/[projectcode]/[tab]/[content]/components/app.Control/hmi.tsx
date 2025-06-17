"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Maximize2, Download, Printer, AlertTriangle, Thermometer, Gauge, Droplets, Zap } from "lucide-react"
import type { Project } from "@/lib/project/types"

type HMIControlProps = {
  project: Project
  mockData?: any
}

export function HMIControl({ project, mockData }: HMIControlProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">HMI画面</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Maximize2 className="h-4 w-4 mr-2" />
            全画面表示
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            画面保存
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            印刷
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* メイン監視画面 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>メイン監視画面</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {/* 温度監視 */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                  温度監視
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "加熱炉温度", value: "1,250℃", status: "正常" },
                    { name: "冷却水温度", value: "45℃", status: "警告" },
                    { name: "排ガス温度", value: "180℃", status: "正常" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{item.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "正常" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 圧力監視 */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                  圧力監視
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "ガス供給圧力", value: "0.8MPa", status: "正常" },
                    { name: "冷却水圧力", value: "0.3MPa", status: "警告" },
                    { name: "油圧", value: "12MPa", status: "正常" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{item.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "正常" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 流量監視 */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Droplets className="h-5 w-5 mr-2 text-cyan-500" />
                  流量監視
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "冷却水流量", value: "120m³/h", status: "正常" },
                    { name: "燃料ガス流量", value: "850Nm³/h", status: "正常" },
                    { name: "圧縮空気流量", value: "2,500Nm³/h", status: "警告" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{item.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "正常" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 警報一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            警報一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "15:30", level: "警告", message: "冷却水温度が上昇しています", status: "未確認" },
              { time: "15:25", level: "注意", message: "圧縮空気流量が低下しています", status: "確認済" },
              { time: "15:20", level: "警告", message: "冷却水圧力が低下しています", status: "未確認" }
            ].map((alarm, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                <span className="w-20 text-sm">{alarm.time}</span>
                <span className={`w-20 px-2 py-1 rounded text-xs ${
                  alarm.level === "警告" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {alarm.level}
                </span>
                <span className="flex-1 text-sm">{alarm.message}</span>
                <span className={`w-20 text-right text-sm ${
                  alarm.status === "未確認" ? "text-red-600" : "text-gray-500"
                }`}>
                  {alarm.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 操作パネル */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-500" />
            操作パネル
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">加熱炉</span>
                <span className="text-sm text-gray-500">起動/停止</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">冷却水</span>
                <span className="text-sm text-gray-500">ポンプ制御</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">ガス供給</span>
                <span className="text-sm text-gray-500">流量調整</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">緊急停止</span>
                <span className="text-sm text-red-500">EMERGENCY</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※警報が発生した場合は、速やかに対応してください。</p>
        <p>※操作パネルの使用は、承認された担当者のみが行ってください。</p>
      </div>
    </div>
  )
} 