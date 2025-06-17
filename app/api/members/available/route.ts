import { NextResponse } from "next/server"
import { openDb } from "@/lib/project/db"

export async function GET() {
  try {
    const db = await openDb()
    
    // 利用可能なメンバー（ユーザー）を取得
    // 実際には、部門所属情報から活動中のメンバーを取得する
    const members = await db.all(`
      SELECT DISTINCT
        user_id as id,
        user_id as name, -- 本来はユーザー名を取得するが、ここではIDで代用
        b.name as department
      FROM bumon_member_history bmh
      LEFT JOIN bumon b ON bmh.bumon_id = b.bumon_id
      WHERE (bmh.end_date IS NULL OR bmh.end_date > date('now'))
      ORDER BY user_id
    `)
    
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching available members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
} 