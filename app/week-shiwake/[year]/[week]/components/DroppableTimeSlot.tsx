"use client"

import { useDroppable } from "@dnd-kit/core"
import { FIFTEEN_MIN_HEIGHT, TIME_SLOT_HEIGHT } from "../utils/dateUtils"

type DroppableTimeSlotProps = {
  day: Date
  hour: number
  minute: number
  isToday: boolean
  dayIndex: number
  onClick: (day: Date, hour: number, minute: number) => void
}

export const DroppableTimeSlot = ({ day, hour, minute, isToday, dayIndex, onClick }: DroppableTimeSlotProps) => {
  // 15分の高さを計算（1時間 = 64px）
  // const fifteenMinHeight = 64 / 4 // 15分 = 16px

  const { setNodeRef, isOver } = useDroppable({
    id: `${day.toISOString()}-${hour}-${minute}`,
    data: {
      day,
      hour,
      minute,
      // 定数を使用
      dropOffset: FIFTEEN_MIN_HEIGHT,
    },
  })

  // 30分刻みの高さを計算（1時間 = 64px）
  const slotHeight = TIME_SLOT_HEIGHT / 2 // 30分あたり32px

  // 背景色の設定
  const getBgColor = () => {
    if (isOver) return "bg-green-100"
    if (isToday) return "bg-blue-50/30"
    if (dayIndex === 0) return "bg-red-50/30"
    if (dayIndex === 6) return "bg-blue-50/30"
    return ""
  }

  return (
    <div
      ref={setNodeRef}
      className={`border-r ${getBgColor()} relative`}
      style={{
        height: `${slotHeight}px`,
        borderBottom:
          minute === 0
            ? "1px dashed #d1d5db" // 1時間区切りは点線（薄めのグレー#d1d5db）
            : "1px solid #9ca3af", // 30分区切りは実線（濃いめのグレー#9ca3af）
      }}
      onClick={() => onClick(day, hour, minute)}
    >
      {isOver && (
        <div
          className="absolute bg-green-200 opacity-50 pointer-events-none z-10"
          style={{
            left: 0,
            right: 0,
            top: `0px`, // 上端に変更
            height: `${slotHeight}px`, // スロット全体をハイライト
          }}
        />
      )}
    </div>
  )
}
