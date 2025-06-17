import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

// ユーザーの全プロジェクトの購入品を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userID = searchParams.get("userID")
    const refresh = searchParams.get("refresh") === "true"

    if (!userID) {
      return NextResponse.json({ success: false, message: "ユーザーIDが指定されていません" }, { status: 400 })
    }

    const db = await getDbConnection()

    // ユーザーが参加しているプロジェクトを取得
    const userProjects = await db.all("SELECT projectCode FROM user_projects WHERE userID = ?", [userID])

    if (userProjects.length === 0) {
      await db.close()
      return NextResponse.json({
        success: true,
        data: [],
        message: "ユーザーが参加しているプロジェクトはありません",
      })
    }

    // プロジェクトコードのリストを作成
    const projectCodes = userProjects.map((p) => p.projectCode)
    const placeholders = projectCodes.map(() => "?").join(",")

    // ユーザーの全プロジェクトの購入品を取得
    const purchaseItems = await db.all(
      `SELECT * FROM project_purchase_items WHERE projectCode IN (${placeholders}) ORDER BY projectCode, equipmentNumber, sequenceNumber`,
      projectCodes,
    )

    await db.close()

    return NextResponse.json({
      success: true,
      data: purchaseItems,
    })
  } catch (error) {
    console.error("ユーザーの購入品リストの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "ユーザーの購入品リストの取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
