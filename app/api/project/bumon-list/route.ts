import { NextResponse } from "next/server"
import { openDb } from "@/lib/project/db"

export async function GET() {
  try {
    const db = await openDb()

    // bumonテーブルの全レコードを取得
    const bumonList = await db.all("SELECT * FROM bumon")

    // 部門名の一覧を取得（デバッグ用）
    const bumonNames = bumonList.map((b) => b.name)
    console.log("Available bumon names:", bumonNames)

    return NextResponse.json(bumonList)
  } catch (error) {
    console.error("Error fetching bumon list:", error)
    return NextResponse.json({ error: "Failed to fetch bumon list" }, { status: 500 })
  }
}
