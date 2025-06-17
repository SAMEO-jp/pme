import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

// 購入品詳細を取得
export async function GET(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const itemId = params.itemId

    const db = await getDbConnection()

    const item = await db.get("SELECT * FROM project_purchase_items WHERE keyID = ?", [itemId])
    await db.close()

    if (!item) {
      return NextResponse.json({ success: false, message: "指定された購入品が見つかりません" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error("購入品詳細の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "購入品詳細の取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// 購入品詳細を更新
export async function PUT(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const itemId = params.itemId
    const purchaseItem = await request.json()

    // 必須フィールドのバリデーション
    if (!purchaseItem.projectCode || !purchaseItem.equipmentNumber || !purchaseItem.itemName) {
      return NextResponse.json(
        { success: false, message: "プロジェクトコード、設備番号、品名は必須です" },
        { status: 400 },
      )
    }

    const db = await getDbConnection()

    // 購入品が存在するか確認
    const existingItem = await db.get("SELECT keyID FROM project_purchase_items WHERE keyID = ?", [itemId])

    if (!existingItem) {
      await db.close()
      return NextResponse.json({ success: false, message: "指定された購入品が見つかりません" }, { status: 404 })
    }

    // 更新するフィールドと値を準備
    const fields = Object.keys(purchaseItem).filter((key) => key !== "keyID")
    const setClause = fields.map((field) => `${field} = ?`).join(", ")
    const values = [...fields.map((field) => purchaseItem[field]), itemId]

    // 購入品詳細を更新
    await db.run(`UPDATE project_purchase_items SET ${setClause} WHERE keyID = ?`, values)
    await db.close()

    return NextResponse.json({
      success: true,
      message: "購入品詳細が正常に更新されました",
    })
  } catch (error) {
    console.error("購入品詳細の更新中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "購入品詳細の更新中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// 購入品詳細を削除
export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const itemId = params.itemId

    const db = await getDbConnection()

    // 購入品が存在するか確認
    const existingItem = await db.get("SELECT keyID FROM project_purchase_items WHERE keyID = ?", [itemId])

    if (!existingItem) {
      await db.close()
      return NextResponse.json({ success: false, message: "指定された購入品が見つかりません" }, { status: 404 })
    }

    // 購入品を削除
    await db.run("DELETE FROM project_purchase_items WHERE keyID = ?", [itemId])
    await db.close()

    return NextResponse.json({
      success: true,
      message: "購入品が正常に削除されました",
    })
  } catch (error) {
    console.error("購入品の削除中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "購入品の削除中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
