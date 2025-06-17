"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Clock, User, CalendarDays, FileText } from "lucide-react"

interface AttendanceViewProps {
  year: number
  month: number
}

// セッションのユーザー型を拡張
interface UserData {
  employeeNumber: string
  name: string
  department: string
  position: string
  attendance: any[]
}

// 営業日（1）、休日（0）、祝日（-1）を設定
const WORK_STATUS = {
  WORKDAY: 1,
  WEEKEND: 0,
  HOLIDAY: -1
}

export default function AttendanceView({ year, month }: AttendanceViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dates, setDates] = useState<Date[]>([])
  const [workStatus, setWorkStatus] = useState<Record<string, number>>({})
  
  // 月の日付配列を生成
  useEffect(() => {
    const days = []
    const lastDay = new Date(year, month, 0).getDate()
    
    for (let day = 1; day <= lastDay; day++) {
      days.push(new Date(year, month - 1, day))
    }
    
    setDates(days)
    
    // 日付ごとの営業日/休日情報を生成
    const status: Record<string, number> = {}
    days.forEach(date => {
      const dayOfWeek = date.getDay()
      const dateKey = formatDate(date)
      
      // 土日は休日とする
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status[dateKey] = WORK_STATUS.WEEKEND
      } else {
        status[dateKey] = WORK_STATUS.WORKDAY
      }
    })
    
    // TODO: 祝日情報を追加する場合はここで設定
    
    setWorkStatus(status)
  }, [year, month])

  // ユーザーデータと出退勤データを取得
  useEffect(() => {
    const fetchUserAttendance = async () => {
      setLoading(true)
      try {
        // 現在のユーザー情報を取得
        const userResponse = await fetch('/api/auth/me')
        const userData = await userResponse.json()
        
        if (!userData.success) {
          console.error('ユーザー情報の取得に失敗しました')
          setLoading(false)
          return
        }
        
        // ログインユーザーの従業員番号を取得
        const employeeId = userData.data.employeeNumber || 'E001' // デフォルト値を設定
        
        // 出退勤データを取得
        const attendanceResponse = await fetch(
          `/api/attendance/${year}/${month}?employeeId=${employeeId}`
        )
        const attendanceData = await attendanceResponse.json()
        
        // ユーザー情報をセット
        setUserData({
          employeeNumber: employeeId,
          name: userData.data.name || '表示名なし',
          department: userData.data.department || '所属なし',
          position: userData.data.position || '役職なし',
          attendance: attendanceData.success ? attendanceData.data : []
        })
      } catch (error) {
        console.error('出退勤データの取得中にエラーが発生しました:', error)
        
        // エラー時にはダミーデータを使用（開発用）
        setUserData({
          employeeNumber: 'E001',
          name: '山田 太郎',
          department: '開発部',
          position: '主任',
          attendance: []
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserAttendance()
  }, [year, month])
  
  // 日付のフォーマット（yyyy-MM-dd）
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  
  // 表示用の日付フォーマット（M/d（曜））
  const formatDisplayDate = (date: Date): string => {
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    return `${date.getMonth() + 1}/${date.getDate()}（${dayOfWeek}）`
  }
  
  // 時間のフォーマット（HH:mm）
  const formatTime = (timeString: string): string => {
    if (!timeString) return '-'
    const date = new Date(timeString)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  // 出退勤ステータスを取得
  const getAttendanceStatus = (date: Date) => {
    if (!userData) return null
    
    const dateKey = formatDate(date)
    const dayAttendance = userData.attendance.find((a: any) => a.date === dateKey)
    
    if (!dayAttendance) {
      return workStatus[dateKey] <= 0 ? null : { status: 'missing', color: 'text-red-500' }
    }
    
    return {
      checkIn: dayAttendance.checkIn,
      checkOut: dayAttendance.checkOut,
      status: dayAttendance.status || 'normal',
      color: getStatusColor(dayAttendance.status),
      remark: dayAttendance.remark || ''
    }
  }
  
  // ステータスに応じた色を取得
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'late':
        return 'text-amber-500'
      case 'early':
        return 'text-blue-500'
      case 'absent':
        return 'text-red-500'
      case 'vacation':
        return 'text-green-500'
      default:
        return 'text-gray-900'
    }
  }
  
  // 日付セルのスタイルを取得
  const getDateCellStyle = (date: Date) => {
    const dateKey = formatDate(date)
    const dayOfWeek = date.getDay()
    
    if (workStatus[dateKey] === WORK_STATUS.WEEKEND) {
      return dayOfWeek === 0 ? 'bg-red-50' : 'bg-blue-50' // 日曜:赤、土曜:青
    } else if (workStatus[dateKey] === WORK_STATUS.HOLIDAY) {
      return 'bg-red-50' // 祝日:赤
    }
    
    return ''
  }
  
  // ステータスの日本語表示
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'late':
        return '遅刻'
      case 'early':
        return '早退'
      case 'absent':
        return '欠勤'
      case 'vacation':
        return '休暇'
      case 'missing':
        return '未入力'
      default:
        return '通常'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // ユーザーデータがない場合
  if (!userData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">
          <CalendarDays className="inline-block mr-2 h-5 w-5" /> 
          {year}年{month}月 出退勤表
        </h2>
        <p className="text-gray-500">
          出退勤情報を取得できませんでした。
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      <div className="overflow-y-auto overflow-x-auto flex-1">
        <Table className="compact-table">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gray-100">
              <TableHead className="w-40 py-2">日付</TableHead>
              <TableHead className="w-32 py-2">ステータス</TableHead>
              <TableHead className="w-32 py-2">出勤時間</TableHead>
              <TableHead className="w-32 py-2">退勤時間</TableHead>
              <TableHead className="py-2">備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dates.map(date => {
              const dateKey = formatDate(date)
              const isWeekend = workStatus[dateKey] === WORK_STATUS.WEEKEND
              const attendanceStatus = getAttendanceStatus(date)
              
              // 休日かつ出勤データがない場合はスキップ
              if (isWeekend && !attendanceStatus) {
                return (
                  <TableRow key={dateKey} className={getDateCellStyle(date)}>
                    <TableCell className="font-medium py-1">
                      {formatDisplayDate(date)}
                    </TableCell>
                    <TableCell colSpan={4} className="text-center text-gray-400 py-1">
                      休日
                    </TableCell>
                  </TableRow>
                )
              }
              
              return (
                <TableRow key={dateKey} className={getDateCellStyle(date)}>
                  <TableCell className="font-medium py-1">
                    {formatDisplayDate(date)}
                  </TableCell>
                  <TableCell className={`py-1 ${attendanceStatus ? attendanceStatus.color : ''}`}>
                    {attendanceStatus ? getStatusText(attendanceStatus.status) : '-'}
                  </TableCell>
                  <TableCell className="py-1">
                    {attendanceStatus && attendanceStatus.checkIn ? (
                      <div className="font-mono text-xs flex items-center">
                        <Clock className="inline-block mr-1 h-3 w-3" />
                        {formatTime(attendanceStatus.checkIn)}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="py-1">
                    {attendanceStatus && attendanceStatus.checkOut ? (
                      <div className="font-mono text-xs flex items-center">
                        <Clock className="inline-block mr-1 h-3 w-3" />
                        {formatTime(attendanceStatus.checkOut)}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-xs py-1">
                    {attendanceStatus && attendanceStatus.remark ? (
                      <div className="flex items-center">
                        <FileText className="inline-block mr-1 h-3 w-3 text-gray-400" />
                        {attendanceStatus.remark}
                      </div>
                    ) : '-'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      
      <style jsx global>{`
        .compact-table td, .compact-table th {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
      `}</style>
    </div>
  )
} 