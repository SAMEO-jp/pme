import { NextResponse } from "next/server"
import { getDb } from "@/lib/bumon/db"

export async function GET() {
  try {
    const db = await getDb()
    
    // データベース内のテーブル一覧を取得
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    
    let tableDetails = {};
    
    // 各テーブルの構造を取得
    for(const table of tables) {
      const tableName = table.name;
      const tableInfo = await db.all(`PRAGMA table_info(${tableName})`);
      tableDetails[tableName] = tableInfo;
    }
    
    return NextResponse.json({ 
      success: true, 
      tables: tables.map(t => t.name),
      tableDetails
    })
  } catch (error) {
    console.error("Failed to check database tables:", error)
    return NextResponse.json({ 
      success: false, 
      error: "データベーステーブルの確認に失敗しました" 
    }, { status: 500 })
  }
} 