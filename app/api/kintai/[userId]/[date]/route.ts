import { NextResponse } from "next/server"
import { open } from "sqlite"
import sqlite3 from "sqlite3"
import path from "path"

// データベース接続ヘルパー関数
async function getDb() {
  return open({
    filename: path.join(process.cwd(), "data", "achievements.db"),
    driver: sqlite3.Database,
  })
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string; date: string } }
) {
  const { userId, date } = params
  
  try {
    // ユーザーIDと日付の形式を検証
    if (!userId || !date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({ success: false, message: "無効なユーザーIDまたは日付形式です" }, { status: 400 })
    }

    const db = await getDb()
    
    try {
      // m_kintaiテーブルから出退勤時間を取得
      const kintaiData = await db.get(
        "SELECT * FROM m_kintai WHERE user_id = ? AND date = ?",
        [userId, date]
      )
      
      // データが存在しない場合は空のデータを返す
      if (!kintaiData) {
        return NextResponse.json({ 
          success: true, 
          data: {
            user_id: userId,
            date: date,
            clock_in: null,
            clock_out: null,
            break_minutes: 0,
            status: '出勤'
          }
        })
      }
      
      return NextResponse.json({ success: true, data: kintaiData })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("出退勤時間の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "出退勤時間の取得中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; date: string } }
) {
  const { userId, date } = params
  
  try {
    // ユーザーIDと日付の形式を検証
    if (!userId || !date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({ success: false, message: "無効なユーザーIDまたは日付形式です" }, { status: 400 })
    }
    
    // リクエストボディを取得
    const body = await request.json()
    const { clock_in, clock_out, break_minutes = 0, status = '出勤' } = body
    
    // 出勤・退勤時間のフォーマットを検証
    if (clock_in && !clock_in.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      return NextResponse.json({ success: false, message: "無効な出勤時間形式です" }, { status: 400 })
    }
    
    if (clock_out && !clock_out.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      return NextResponse.json({ success: false, message: "無効な退勤時間形式です" }, { status: 400 })
    }
    
    const db = await getDb()
    
    try {
      // m_kintaiテーブルに出退勤時間を挿入または更新
      await db.run(
        `INSERT OR REPLACE INTO m_kintai 
        (user_id, date, clock_in, clock_out, break_minutes, status, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))`,
        [userId, date, clock_in, clock_out, break_minutes, status]
      )
      
      // 更新後のデータを取得
      const updatedData = await db.get(
        "SELECT * FROM m_kintai WHERE user_id = ? AND date = ?",
        [userId, date]
      )
      
      return NextResponse.json({ success: true, data: updatedData })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("出退勤時間の更新中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "出退勤時間の更新中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
} 