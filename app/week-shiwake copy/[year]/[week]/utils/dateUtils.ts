// 日付関連のユーティリティ関数
import { TIME_SLOT_HEIGHT, FIFTEEN_MIN_HEIGHT, FIFTEEN_MIN_RATIO, minuteSlots } from "./constants"

export { TIME_SLOT_HEIGHT, FIFTEEN_MIN_HEIGHT, FIFTEEN_MIN_RATIO, minuteSlots }

// 30分刻みのスロットを定義
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export function getWeekDates(year: number, week: number): { startDate: Date; endDate: Date } {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() === 0 ? 6 : firstDayOfYear.getDay() - 1
  const firstWeekDay = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset)
  const startDate = new Date(firstWeekDay)
  startDate.setDate(firstWeekDay.getDate() - firstWeekDay.getDay())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return { startDate, endDate }
}

export function getWeekDaysArray(startDate: Date, endDate: Date): Date[] {
  const days = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return days
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`
}

export function formatDateShort(date: Date): string {
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
}

export function formatDayWithWeekday(date: Date): string {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
  return `${date.getMonth() + 1}/${date.getDate()}(${weekdays[date.getDay()]})`
}

export function formatDateTimeForStorage(date: Date): string {
  // ISO文字列ではなく、明示的にローカル時間のフォーマットを使用
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")

  // T区切りを使わず、スペース区切りを使用
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function parseDateTime(dateTimeStr: string): Date {
  // 日付文字列がT区切りの場合はスペースに置換
  const normalizedStr = dateTimeStr.replace("T", " ")

  // YYYY-MM-DD hh:mm:ss 形式を解析
  const [datePart, timePart] = normalizedStr.split(" ")
  const [year, month, day] = datePart.split("-").map(Number)
  const [hours, minutes, seconds] = timePart.split(":").map(Number)

  // 明示的にローカル時間のDateオブジェクトを作成
  return new Date(year, month - 1, day, hours, minutes, seconds || 0)
}
