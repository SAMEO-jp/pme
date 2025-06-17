import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  year: number
  week: number
  prevYear: number
  prevWeek: number
  nextYear: number
  nextWeek: number
  startDate: Date
  endDate: Date
  formatDateShort: (date: Date) => string
  saveMessage?: { type: string; text: string } | null
}

export function WeekShiwakeCenter({
  year,
  week,
  prevYear,
  prevWeek,
  nextYear,
  nextWeek,
  startDate,
  endDate,
  formatDateShort,
  saveMessage
}: Props) {
  return (
    <div className="flex items-center">
      <Link
        href={`/week-shiwake/${prevYear}/${prevWeek}`}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="前週"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <span className="mx-2 font-medium text-lg">
        {year}年 第{week}週 ({formatDateShort(startDate)} - {formatDateShort(endDate)})
      </span>
      <Link
        href={`/week-shiwake/${nextYear}/${nextWeek}`}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="翌週"
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
      {saveMessage && (
        <div
          className={`ml-4 px-4 py-2 rounded-md transition-opacity duration-300 ${
            saveMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {saveMessage.text}
        </div>
      )}
    </div>
  )
} 