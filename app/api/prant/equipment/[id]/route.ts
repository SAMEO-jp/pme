import { NextResponse } from "next/server"
import * as db from "@/lib/prant/db"

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params
    const equipmentId = parseInt(id, 10)
    
    // IDが数値でない場合はエラー
    if (isNaN(equipmentId)) {
      return NextResponse.json(
        { error: "無効な設備IDです" },
        { status: 400 }
      )
    }
    
    // 設備の基本情報を取得
    const equipment = await db.getEquipmentById(equipmentId)
    
    if (!equipment) {
      return NextResponse.json(
        { error: "指定された設備が見つかりません" },
        { status: 404 }
      )
    }
    
    // 設備の運転データを取得（直近30日分）
    const operations = await db.getEquipmentOperations(equipmentId, 30)
    
    // 設備の保全記録を取得
    const maintenanceRecords = await db.getMaintenanceRecords(equipmentId)
    
    // 設備の異常イベントを取得
    const abnormalEvents = await db.getAbnormalEvents(equipmentId)
    
    // 全てのデータを結合して返す
    return NextResponse.json({
      equipment,
      operations,
      maintenanceRecords,
      abnormalEvents
    })
    
  } catch (error) {
    console.error(`Error fetching equipment data for ID ${params.id}:`, error)
    return NextResponse.json(
      { error: "設備データの取得に失敗しました" },
      { status: 500 }
    )
  }
} 