"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/project/types"

type ScheduleMainProps = {
  project: Project
  mockData: {
    schedules: {
      id: number
      date: string
      title: string
    }[]
  }
}

export function ScheduleMain({ project, mockData }: ScheduleMainProps) {
  // 当月のカレンダーを生成するためのデータ
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  // 週の配列を生成
  const weeks = []
  let days = []
  
  // 前月の日を追加
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  
  // 当月の日を追加
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
    
    if (days.length === 7) {
      weeks.push(days)
      days = []
    }
  }
  
  // 残りの空白を埋める
  if (days.length > 0) {
    for (let i = days.length; i < 7; i++) {
      days.push(null)
    }
    weeks.push(days)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクト予定表</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          予定追加
        </Button>
      </div>
      
      {/* カレンダーと予定リストのレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 月間カレンダー */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-red-500" />
                2025年5月
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* 曜日ヘッダー */}
              {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                <div key={i} className="text-center py-2 font-medium">
                  {day}
                </div>
              ))}
              
              {/* カレンダー日付 */}
              {weeks.map((week, weekIndex) => (
                week.map((day, dayIndex) => (
                  <div 
                    key={`${weekIndex}-${dayIndex}`} 
                    className={`p-2 min-h-[80px] border rounded-md ${day ? 'bg-white' : 'bg-gray-50'} ${day === currentDate.getDate() ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium">{day}</div>
                        {/* 予定がある場合は表示 */}
                        {mockData.schedules.some(s => {
                          const scheduleDate = new Date(s.date)
                          return scheduleDate.getDate() === day && 
                                scheduleDate.getMonth() === currentMonth && 
                                scheduleDate.getFullYear() === currentYear
                        }) && (
                          <div className="mt-1 text-xs bg-red-100 text-red-800 p-1 rounded truncate">
                            予定あり
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )).flat()}
            </div>
          </CardContent>
        </Card>
        
        {/* 予定リスト */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              今後の予定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.schedules.map(schedule => (
                <div key={schedule.id} className="p-3 border rounded-md hover:shadow-md transition-all">
                  <div className="text-sm text-gray-500">{schedule.date}</div>
                  <div className="font-medium">{schedule.title}</div>
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
              <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                全予定表示
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* マイルストーン一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            プロジェクトマイルストーン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* マイルストーンのタイムライン */}
            <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              <div className="flex">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 mr-4">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">プロジェクト開始</div>
                  <div className="text-sm text-gray-500">2025/05/01</div>
                  <div className="text-sm text-gray-600 mt-1">キックオフミーティングを実施し、プロジェクト計画を確定。</div>
                </div>
              </div>
              <div className="flex">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">基本設計完了</div>
                  <div className="text-sm text-gray-500">2025/05/15</div>
                  <div className="text-sm text-gray-600 mt-1">基本設計書の作成と承認。要件の確定。</div>
                </div>
              </div>
              <div className="flex">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-4">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">詳細設計完了</div>
                  <div className="text-sm text-gray-500">2025/06/01</div>
                  <div className="text-sm text-gray-600 mt-1">詳細設計書の完成と最終承認。</div>
                </div>
              </div>
              <div className="flex">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-4">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">製造・工事開始</div>
                  <div className="text-sm text-gray-500">2025/06/15</div>
                  <div className="text-sm text-gray-600 mt-1">部品調達と製造工程の開始。</div>
                </div>
              </div>
              <div className="flex">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-4">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">プロジェクト完了</div>
                  <div className="text-sm text-gray-500">2025/08/30</div>
                  <div className="text-sm text-gray-600 mt-1">最終検査と引き渡し。</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 