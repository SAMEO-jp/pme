import { NextResponse } from "next/server"
import { open } from "sqlite"
import sqlite3 from "sqlite3"
import path from "path"

// 週の開始日と終了日を計算する関数
function getWeekDates(year: number, week: number) {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() // 0: Sunday, 1: Monday, etc.
  
  // 週の開始日を計算（日曜開始）
  const startDate = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset)
  
  // 週の終了日を計算（土曜日）
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  
  return { startDate, endDate }
}

// 日付をYYYY-MM-DD形式に変換する関数
function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// データベース接続ヘルパー関数
async function getDb() {
  return open({
    filename: path.join(process.cwd(), "data", "achievements.db"),
    driver: sqlite3.Database,
  })
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string; year: string; week: string } }
) {
  const { userId, year, week } = params
  
  try {
    // パラメータのバリデーション
    const yearNum = Number.parseInt(year)
    const weekNum = Number.parseInt(week)
    
    if (isNaN(yearNum) || isNaN(weekNum) || !userId) {
      return NextResponse.json({ success: false, message: "無効なパラメータです" }, { status: 400 })
    }
    
    // 週の日付範囲を取得
    const { startDate, endDate } = getWeekDates(yearNum, weekNum)
    
    // 週の各日の日付を生成
    const dates = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    const db = await getDb()
    
    try {
      // 指定されたユーザーと日付範囲の出退勤データを取得
      const kintaiData = await db.all(
        `SELECT * FROM m_kintai 
         WHERE user_id = ? AND date BETWEEN ? AND ?
         ORDER BY date`,
        [userId, formatDate(startDate), formatDate(endDate)]
      )
      
      // 各日のデータを整形（存在しない日付は空のデータを作成）
      const result = dates.map(date => {
        const existingData = kintaiData.find(k => k.date === date)
        if (existingData) {
          return existingData
        }
        
        // 存在しない場合はデフォルトデータを作成
        return {
          user_id: userId,
          date: date,
          clock_in: null,
          clock_out: null,
          break_minutes: 0,
          status: '出勤'
        }
      })
      
      return NextResponse.json({ success: true, data: result })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("週の勤怠データ取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "週の勤怠データ取得中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string; year: string; week: string } }
) {
  const { userId, year, week } = params
  
  try {
    // パラメータのバリデーション
    const yearNum = Number.parseInt(year)
    const weekNum = Number.parseInt(week)
    
    if (isNaN(yearNum) || isNaN(weekNum) || !userId) {
      return NextResponse.json({ success: false, message: "無効なパラメータです" }, { status: 400 })
    }
    
    // リクエストボディを取得
    const body = await request.json()
    const { workTimes } = body
    
    if (!Array.isArray(workTimes) || workTimes.length === 0) {
      return NextResponse.json({ success: false, message: "無効な勤怠データです" }, { status: 400 })
    }
    
    const db = await getDb()
    
    try {
      // トランザクション開始
      await db.run('BEGIN TRANSACTION')
      
      // 各日のデータを更新
      for (const data of workTimes) {
        const { date, startTime, endTime } = data
        
        // 日付の形式を検証
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          continue // 無効な日付はスキップ
        }
        
        // clock_inとclock_outを生成
        const clockIn = startTime ? `${date} ${startTime}:00` : null
        const clockOut = endTime ? `${date} ${endTime}:00` : null
        
        // 現在のデータを取得
        const existingData = await db.get(
          "SELECT * FROM m_kintai WHERE user_id = ? AND date = ?",
          [userId, date]
        )
        
        if (existingData) {
          // 既存データを更新
          await db.run(
            `UPDATE m_kintai 
             SET clock_in = ?, clock_out = ?, updated_at = datetime('now', 'localtime')
             WHERE user_id = ? AND date = ?`,
            [clockIn, clockOut, userId, date]
          )
        } else if (clockIn || clockOut) {
          // 新規データ（時間がある場合のみ）を作成
          await db.run(
            `INSERT INTO m_kintai 
             (user_id, date, clock_in, clock_out, break_minutes, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
            [userId, date, clockIn, clockOut, 60, '出勤']
          )
        }
      }
      
      // トランザクションをコミット
      await db.run('COMMIT')
      
      // 更新後のデータを取得
      const { startDate, endDate } = getWeekDates(yearNum, weekNum)
      const updatedData = await db.all(
        `SELECT * FROM m_kintai 
         WHERE user_id = ? AND date BETWEEN ? AND ?
         ORDER BY date`,
        [userId, formatDate(startDate), formatDate(endDate)]
      )
      
      return NextResponse.json({ success: true, data: updatedData })
    } catch (error) {
      // エラー発生時はロールバック
      await db.run('ROLLBACK')
      throw error
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("週の勤怠データ更新中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "週の勤怠データ更新中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
} 