"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react"
import type { Project } from "@/lib/project/types"

type MembersDetailProps = {
  project: Project
  memberId: string
  mockData?: any
}

export function MembersDetail({ project, memberId, mockData }: MembersDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">メンバー詳細</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            メール
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            電話
          </Button>
        </div>
      </div>
      
      {/* メンバー基本情報 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              <AvatarFallback className="bg-gray-100 text-gray-800 text-3xl">
                田中
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">田中 三郎</h3>
                <p className="text-gray-500">設計</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>tanaka.saburo@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>090-1234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>本社 設計部</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>入社: 2020年4月</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 担当業務 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>担当業務</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">役割</h3>
              <p className="mt-1">設計担当</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">主要タスク</h3>
              <p className="mt-1">機械設計、構造計算</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">サポート担当</h3>
              <p className="mt-1">佐藤 二郎</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 経歴 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>経歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 w-24">
                <p className="text-sm text-gray-500">2020年4月</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                  <h4 className="font-medium">株式会社〇〇 入社</h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">設計部 配属</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24">
                <p className="text-sm text-gray-500">2022年4月</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                  <h4 className="font-medium">設計部 主任</h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">プロジェクトリーダーとして活動</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 注釈 */}
      <div className="text-sm text-gray-500">
        <p>※メンバー情報は社内規定に従い適切に取り扱ってください。</p>
        <p>※個人情報の取り扱いには十分注意してください。</p>
      </div>
    </div>
  )
} 