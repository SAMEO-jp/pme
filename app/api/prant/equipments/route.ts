import { NextResponse } from "next/server"
import * as db from "@/lib/prant/db"

export async function GET() {
  try {
    // データベースからすべての設備を取得
    const equipments = await db.getAllEquipments()
    
    return NextResponse.json(equipments)
  } catch (error) {
    console.error("Error fetching equipments:", error)
    return NextResponse.json(
      { error: "設備データの取得に失敗しました" },
      { status: 500 }
    )
  }
} 