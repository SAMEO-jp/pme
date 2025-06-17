import { NextResponse } from "next/server"
import { getProjectPurchaseItems, addProjectPurchaseItem } from "@/lib/db_utils"

// プロジェクト購入品リストを取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectCode = searchParams.get("projectCode")
    const equipmentNumber = searchParams.get("equipmentNumber")

    if (!projectCode) {
      return NextResponse.json({ success: false, message: "プロジェクトコードは必須です" }, { status: 400 })
    }

    let purchaseItems = []
    if (equipmentNumber) {
      // 設備番号指定時は従来通り
      purchaseItems = await getProjectPurchaseItems(projectCode, equipmentNumber)
    } else {
      // equipmentNumber未指定時はプロジェクト全体の購入品リストを返す
      const db = await (await import("@/lib/db_utils")).getDbConnection()
      try {
        purchaseItems = await db.all(
          "SELECT * FROM project_purchase_items WHERE project_id = ? ORDER BY equipmentNumber, sequenceNumber",
          [projectCode]
        )
      } finally {
        await db.close()
      }
    }

    return NextResponse.json({
      success: true,
      data: purchaseItems,
    })
  } catch (error) {
    console.error("プロジェクト購入品の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "プロジェクト購入品の取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// プロジェクト購入品を追加
export async function POST(request: Request) {
  try {
    const purchaseItem = await request.json()

    // 必須フィールドのバリデーション
    if (!purchaseItem.projectCode || !purchaseItem.equipmentNumber || !purchaseItem.itemName) {
      return NextResponse.json(
        { success: false, message: "プロジェクトコード、設備番号、品名は必須です" },
        { status: 400 },
      )
    }

    const keyID = await addProjectPurchaseItem(purchaseItem)

    return NextResponse.json({
      success: true,
      message: "プロジェクト購入品が正常に追加されました",
      keyID,
    })
  } catch (error) {
    console.error("プロジェクト購入品の追加中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "プロジェクト購入品の追加中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
