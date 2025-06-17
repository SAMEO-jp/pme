import { NextResponse } from "next/server"
import * as db from "@/lib/prant/db"

export async function GET() {
  try {
    // システム全体の統計情報を取得
    const stats = await db.getSystemStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return NextResponse.json(
      { error: "システム統計情報の取得に失敗しました" },
      { status: 500 }
    )
  }
} 