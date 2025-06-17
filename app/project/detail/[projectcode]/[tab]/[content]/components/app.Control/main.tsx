"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Network, Shield, Bell, BookOpen, History, PlusCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ControlMainProps = {
  project: Project
  mockData?: any
}

export function ControlMain({ project, mockData }: ControlMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">制御システム概要</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          制御仕様書作成
        </Button>
      </div>

      {/* 制御システム情報 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>制御システム情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">制御システム</h3>
              <p className="mt-1">横河電機 CENTUM VP R6.08</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">HMI</h3>
              <p className="mt-1">横河電機 ProSafe-RS</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ネットワーク</h3>
              <p className="mt-1">Vnet/IP</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">I/O点数</h3>
              <p className="mt-1">AI: 256点, AO: 128点, DI: 512点, DO: 256点</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* クイックリンク */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Settings className="h-5 w-5 mr-2 text-blue-500" />
              シーケンス制御
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">設備の運転シーケンス、連鎖条件、制御ロジック</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Network className="h-5 w-5 mr-2 text-green-500" />
              ネットワーク構成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">制御ネットワーク、通信プロトコル、セキュリティ設定</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-red-500" />
              安全制御
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">安全関連制御、緊急停止、安全インターロック</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-amber-500" />
              警報設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">警報条件、優先度、通知設定</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
              レシピ管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">製品レシピ、パラメータ設定、バッチ管理</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <History className="h-5 w-5 mr-2 text-gray-500" />
              履歴管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">データログ、トレンド、レポート</p>
            <Button variant="outline" className="w-full">詳細を見る</Button>
          </CardContent>
        </Card>
      </div>

      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※制御システムの変更は、必ず承認を得てから実施してください。</p>
        <p>※安全関連の設定変更は、特別な承認が必要です。</p>
      </div>
    </div>
  )
} 