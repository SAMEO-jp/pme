import { NextResponse } from "next/server"
import { getProjectEquipmentNumbers } from "@/lib/db_utils"
import { getEquipmentById } from "@/lib/prant/db"

// プロジェクトの設備番号リストを取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectCode = searchParams.get("projectCode")

    if (!projectCode) {
      return NextResponse.json({ success: false, message: "プロジェクトコードが指定されていません" }, { status: 400 })
    }

    const equipmentNumbers = await getProjectEquipmentNumbers(projectCode)
    // 設備番号ごとに名称も取得
    const equipmentList = []
    for (const equipmentNumber of equipmentNumbers) {
      let equipmentName = ""
      try {
        const equipment = await getEquipmentById(equipmentNumber)
        equipmentName = equipment?.name || ""
      } catch {}
      equipmentList.push({ equipmentNumber, equipmentName })
    }

    return NextResponse.json({
      success: true,
      data: equipmentList,
    })
  } catch (error) {
    console.error("プロジェクト設備番号の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "プロジェクト設備番号の取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
