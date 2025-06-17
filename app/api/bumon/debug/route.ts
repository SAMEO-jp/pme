import { NextResponse } from "next/server"
import { getDb } from "@/lib/bumon/db"

export async function GET() {
  try {
    const db = await getDb()

    // データベース接続の確認
    let dbConnectionStatus = "成功"
    try {
      await db.get("SELECT 1")
    } catch (error) {
      dbConnectionStatus = `失敗: ${error}`
    }

    // bumonテーブルの構造確認
    let bumonStructure = []
    try {
      bumonStructure = await db.all("PRAGMA table_info(bumon)")
    } catch (error) {
      console.error("Failed to get bumon table structure:", error)
    }

    // bumonテーブルのデータ確認
    let bumonData = []
    try {
      bumonData = await db.all("SELECT * FROM bumon LIMIT 10")
    } catch (error) {
      console.error("Failed to get bumon data:", error)
    }

    // bumonテーブルのレコード数
    let bumonCount = 0
    try {
      const result = await db.get("SELECT COUNT(*) as count FROM bumon")
      bumonCount = result.count
    } catch (error) {
      console.error("Failed to count bumon records:", error)
    }

    return NextResponse.json({
      dbConnectionStatus,
      bumonStructure,
      bumonData,
      bumonCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "デバッグ情報の取得に失敗しました" }, { status: 500 })
  }
} 