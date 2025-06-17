"use client"

interface DataDisplayRightSidebarProps {
  selectedDate?: string
  statistics?: {
    workDays: number
    holidayWork: number
    paidLeave: number
  }
}

export default function DataDisplayRightSidebar({ 
  selectedDate = "2024年5月8日",
  statistics = {
    workDays: 20,
    holidayWork: 2,
    paidLeave: 1
  }
}: DataDisplayRightSidebarProps) {
  return (
    <aside className="w-64 border-l h-[calc(100vh-64px)] p-4 bg-gray-50">
      <h3 className="font-medium mb-4">詳細情報</h3>
      <div className="space-y-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium mb-2">選択中の日付</h4>
          <p className="text-sm text-gray-600">{selectedDate}</p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium mb-2">統計情報</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">出勤日数</span>
              <span className="font-medium">{statistics.workDays}日</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">休日出勤</span>
              <span className="font-medium">{statistics.holidayWork}日</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">有給休暇</span>
              <span className="font-medium">{statistics.paidLeave}日</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
} 