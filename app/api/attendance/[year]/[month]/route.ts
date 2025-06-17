import { NextResponse } from "next/server"
import { getDbConnection, getCurrentUser } from "@/lib/db_utils"

interface KintaiRecord {
  user_id: string
  date: string
  clock_in: string | null
  clock_out: string | null
  status: string
}

// 指定された年月の全営業日を取得する関数
function getBusinessDays(year: number, month: number): string[] {
  const lastDay = new Date(year, month, 0).getDate()
  const businessDays: string[] = []
  
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    
    // 土日はスキップ
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    
    // 日付をフォーマット (YYYY-MM-DD)
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    businessDays.push(formattedDate)
  }
  
  return businessDays
}

export async function GET(
  request: Request,
  { params }: { params: { year: string; month: string } }
) {
  const { year, month } = params

  try {
    // 現在のユーザー情報を取得
    const currentUser = await getCurrentUser()
    const employeeId = currentUser.employeeNumber

    if (!employeeId) {
      return NextResponse.json({ success: false, message: "ユーザー情報の取得に失敗しました" }, { status: 400 })
    }

    const yearNum = Number.parseInt(year)
    const monthNum = Number.parseInt(month)

    if (isNaN(yearNum) || isNaN(monthNum)) {
      return NextResponse.json({ success: false, message: "無効な年月です" }, { status: 400 })
    }

    const db = await getDbConnection()
    
    try {
      // 指定された年月の最初の日と最後の日を取得
      const firstDay = new Date(yearNum, monthNum - 1, 1)
      const lastDay = new Date(yearNum, monthNum, 0)
      
      // 営業日のリストを取得
      const businessDays = getBusinessDays(yearNum, monthNum)
      
      // トランザクション開始
      await db.run("BEGIN TRANSACTION")
      
      try {
        // 既存のデータを取得
        const existingData = await db.all<KintaiRecord[]>(
          `SELECT * FROM m_kintai 
           WHERE user_id = ? 
           AND date BETWEEN ? AND ?
           ORDER BY date`,
          [employeeId, firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]]
        )
        
        // 存在しない日付のレコードを作成
        const existingDates = new Set(existingData.map((record: KintaiRecord) => record.date))
        const missingDates = businessDays.filter(date => !existingDates.has(date))
        
        if (missingDates.length > 0) {
          // 存在しない日付のレコードを一括で作成
          const insertValues = missingDates.map(date => 
            `(?, ?, NULL, NULL, 0, '出勤', datetime('now', 'localtime'), datetime('now', 'localtime'))`
          ).join(',')
          
          const insertParams = missingDates.flatMap(date => [employeeId, date])
          
          await db.run(
            `INSERT INTO m_kintai 
             (user_id, date, clock_in, clock_out, break_minutes, status, created_at, updated_at)
             VALUES ${insertValues}`,
            insertParams
          )
        }
        
        // トランザクションをコミット
        await db.run("COMMIT")
        
        // 更新後のデータを取得
        const updatedData = await db.all<KintaiRecord[]>(
          `SELECT * FROM m_kintai 
           WHERE user_id = ? 
           AND date BETWEEN ? AND ?
           ORDER BY date`,
          [employeeId, firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]]
        )

        // データを整形
        const formattedData = updatedData.map((record: KintaiRecord) => ({
          date: record.date,
          employeeId: record.user_id,
          checkIn: record.clock_in,
          checkOut: record.clock_out,
          status: record.status === '年休' ? 'vacation' : 
                  record.clock_in && new Date(record.clock_in).getHours() >= 9 ? 'late' :
                  record.clock_out && new Date(record.clock_out).getHours() < 17 ? 'early' :
                  'normal'
        }))

        return NextResponse.json({ success: true, data: formattedData })
      } catch (error) {
        // エラーが発生した場合はロールバック
        await db.run("ROLLBACK")
        throw error
      }
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("出退勤データの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "出退勤データの取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
} 