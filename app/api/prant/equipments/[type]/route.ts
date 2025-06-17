import { NextResponse } from "next/server"
import * as db from "@/lib/prant/db"

interface Params {
  params: {
    type: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { type } = params
    
    // 有効な設備タイプをチェック
    const validTypes = ["blast-furnace", "steelmaking", "cdq", "rolling", "continuous-casting"]
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "無効な設備タイプです" },
        { status: 400 }
      )
    }
    
    // 指定されたタイプの設備を取得
    const equipments = await db.getEquipmentsByType(type)
    
    return NextResponse.json(equipments)
  } catch (error) {
    console.error(`Error fetching equipments for type ${params.type}:`, error)
    return NextResponse.json(
      { error: "設備データの取得に失敗しました" },
      { status: 500 }
    )
  }
} 