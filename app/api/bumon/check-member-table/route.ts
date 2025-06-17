import { NextResponse } from "next/server"
import { getDb } from "@/lib/bumon/db"

export async function GET() {
  try {
    const db = await getDb()
    
    // bumon_member_historyテーブルの構造を確認
    const tableInfo = await db.all("PRAGMA table_info(bumon_member_history)")
    
    // サンプルデータを取得
    const sampleData = await db.all("SELECT * FROM bumon_member_history LIMIT 5")
    
    return NextResponse.json({ 
      success: true, 
      structure: tableInfo,
      sample: sampleData
    })
  } catch (error) {
    console.error("Failed to check bumon_member_history table:", error)
    return NextResponse.json({ 
      success: false, 
      error: "部門メンバー履歴テーブルの確認に失敗しました" 
    }, { status: 500 })
  }
} 