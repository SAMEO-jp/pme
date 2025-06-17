import { NextResponse } from "next/server"
import { checkTableStructure } from "@/lib/bumon/db"

export async function GET() {
  try {
    const result = await checkTableStructure()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to check database structure:", error)
    return NextResponse.json({ error: "データベース構造の確認に失敗しました" }, { status: 500 })
  }
}
