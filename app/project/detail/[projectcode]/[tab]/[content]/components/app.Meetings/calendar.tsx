"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/project/types"

type MeetingsCalendarProps = {
  project: Project;
  mockData: any;
}

export function MeetingsCalendar({ project, mockData }: MeetingsCalendarProps) {
  const days = ["日", "月", "火", "水", "木", "金", "土"]
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // 月の日数を取得
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // 月の最初の日の曜日を取得
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // カレンダーの日付を生成
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">会議カレンダー</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {currentYear}年{currentMonth + 1}月
          </span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* カレンダー */}
      <Card>
        <CardHeader>
          <CardTitle>会議スケジュール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div
                key={day}
                className="text-center font-medium py-2 border-b"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-2 border ${
                  day === today.getDate() ? "bg-blue-50" : ""
                }`}
              >
                {day && (
                  <div className="h-full">
                    <span className="text-sm">{day}</span>
                    {mockData.meetings
                      ?.filter(
                        (meeting: any) =>
                          new Date(meeting.date).getDate() === day
                      )
                      .map((meeting: any) => (
                        <div
                          key={meeting.id}
                          className="mt-1 text-xs p-1 bg-blue-100 rounded truncate"
                        >
                          {meeting.title}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 凡例 */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span className="text-sm">会議</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-50 rounded"></div>
          <span className="text-sm">今日</span>
        </div>
      </div>
    </div>
  )
} 