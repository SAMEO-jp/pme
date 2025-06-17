import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/bumon/db"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    
    // projectsテーブルの構造を確認
    const projectsTableInfo = await db.all("PRAGMA table_info(projects)")
    
    // projectsテーブルのサンプルデータを取得
    const projectsSample = await db.all("SELECT * FROM projects LIMIT 5")
    
    return NextResponse.json({ 
      success: true, 
      structure: projectsTableInfo,
      sample: projectsSample
    })
  } catch (error) {
    console.error("Failed to check projects table:", error)
    return NextResponse.json({ 
      success: false, 
      error: "プロジェクトテーブルの確認に失敗しました" 
    }, { status: 500 })
  }
}
