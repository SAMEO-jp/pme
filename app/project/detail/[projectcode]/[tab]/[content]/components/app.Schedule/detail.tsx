"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, Users, FileText, AlertCircle } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ScheduleDetailProps = {
  project: Project
  scheduleId: string
  mockData?: any
}

export function ScheduleDetail({ project, scheduleId, mockData }: ScheduleDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">スケジュール詳細</h2>
        <div className="flex space-x-2">
          <Button variant="outline">編集</Button>
          <Button variant="destructive">削除</Button>
        </div>
      </div>
      
      {/* スケジュール基本情報 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">タイトル</h3>
              <p className="mt-1">キックオフミーティング</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">日時</h3>
              <p className="mt-1">2025/05/01 10:00 〜 12:00</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">場所</h3>
              <p className="mt-1">本社 3階 会議室A</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">予定</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* スケジュール詳細 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>詳細情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Clock className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium">アジェンダ</h3>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
                  <li>プロジェクト概要説明</li>
                  <li>チーム編成の確認</li>
                  <li>スケジュールの確認</li>
                  <li>役割分担の決定</li>
                  <li>質疑応答</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium">参加者</h3>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
                  <li>鈴木 一郎（プロマネ）</li>
                  <li>佐藤 二郎（エンジニア）</li>
                  <li>田中 三郎（設計）</li>
                  <li>高橋 四郎（工事）</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FileText className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium">準備資料</h3>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
                  <li>プロジェクト計画書</li>
                  <li>スケジュール表</li>
                  <li>組織図</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 注意事項 */}
      <Card className="shadow-md border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            注意事項
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>※会議室の予約状況を確認してください。</p>
            <p>※参加者への事前資料の共有をお願いします。</p>
            <p>※会議の録画・録音は禁止です。</p>
          </div>
        </CardContent>
      </Card>
      
      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※スケジュールの変更がある場合は、関係者に通知してください。</p>
        <p>※会議の議事録は、終了後24時間以内に共有してください。</p>
      </div>
    </div>
  )
} 