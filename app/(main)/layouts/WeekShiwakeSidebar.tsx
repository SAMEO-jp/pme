"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

// 週番号を取得する関数
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// 週の開始日と終了日を取得する関数
function getWeekDates(year: number, week: number) {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() === 0 ? 6 : firstDayOfYear.getDay() - 1
  const firstWeekDay = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset)
  const startDate = new Date(firstWeekDay)
  startDate.setDate(firstWeekDay.getDate() - firstWeekDay.getDay())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return { startDate, endDate }
}

// 週の日付配列を生成する関数
function getWeekDaysArray(startDate: Date, endDate: Date) {
  const days = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return days
}

// 月のカレンダーデータを生成する関数
function generateMonthCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // 前月の最終日を取得
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
  const firstDayOfWeek = firstDay.getDay()

  const calendarDays = []

  // 前月の日を追加
  for (let i = 0; i < firstDayOfWeek; i++) {
    const day = prevMonthLastDay - firstDayOfWeek + i + 1
    calendarDays.push({
      date: new Date(year, month - 1, day),
      currentMonth: false,
    })
  }

  // 当月の日を追加
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      currentMonth: true,
    })
  }

  // 翌月の日を追加（6週間分になるように）
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      currentMonth: false,
    })
  }

  return calendarDays
}

interface WeekShiwakeSidebarProps {
  year: number
  week: number
}

export default function WeekShiwakeSidebar({ year, week }: WeekShiwakeSidebarProps) {
  const router = useRouter()
  
  // 週の開始日と終了日を計算
  const { startDate } = getWeekDates(year, week)
  
  // カレンダー表示用の月を設定
  const [selectedMonth, setSelectedMonth] = useState<number>(startDate.getMonth())
  
  // カレンダーの月を変更
  const changeMonth = (offset: number) => {
    const newMonth = selectedMonth + offset
    if (newMonth < 0) {
      setSelectedMonth(11)
    } else if (newMonth > 11) {
      setSelectedMonth(0)
    } else {
      setSelectedMonth(newMonth)
    }
  }
  
  // カレンダーの日付をクリックしたときの処理
  const handleCalendarDayClick = (date: Date) => {
    // クリックした日付が含まれる週の週番号を取得
    const weekNum = getWeekNumber(date)
    // その週のページに遷移
    router.push(`/week-shiwake/${date.getFullYear()}/${weekNum}`)
  }
  
  // 週の日付配列を生成
  const weekDays = startDate ? getWeekDaysArray(startDate, new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)) : []
  
  // 今日の日付を取得
  const today = new Date()
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }
  
  return (
    <aside className="w-64 border-r h-[calc(100vh-64px)] p-4 bg-gray-50 overflow-y-auto">
      <h3 className="font-medium mb-1 flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        カレンダー
      </h3>

      {/* カレンダー */}
      <div className="bg-white rounded-lg shadow p-3 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">
            {year}年{selectedMonth !== null ? selectedMonth + 1 : ""}月
          </span>
          <div className="flex">
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          <div className="text-red-500">日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className="text-blue-500">土</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {selectedMonth !== null &&
            generateMonthCalendar(year, selectedMonth).map((day, index) => (
              <div
                key={index}
                className={`p-1 text-sm rounded-full cursor-pointer hover:bg-gray-200 ${
                  day.currentMonth
                    ? isToday(day.date)
                      ? "bg-blue-100 font-bold"
                      : weekDays.some(
                          (weekDay) =>
                            weekDay.getDate() === day.date.getDate() && weekDay.getMonth() === day.date.getMonth(),
                        )
                        ? "bg-gray-100"
                        : ""
                    : "text-gray-400"
                } ${day.date.getDay() === 0 ? "text-red-500" : ""} ${day.date.getDay() === 6 ? "text-blue-500" : ""}`}
                onClick={() => handleCalendarDayClick(day.date)}
              >
                {day.date.getDate()}
              </div>
            ))}
        </div>
      </div>
    </aside>
  )
} 