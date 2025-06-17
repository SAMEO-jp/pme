import { NextResponse } from "next/server"
import { addAchievement, updateAchievement, deleteAchievement } from "@/lib/db_utils"

// 新しい実績データを追加
export async function POST(request: Request) {
  try {
    const achievement = await request.json()

    // 必須フィールドのバリデーション
    if (!achievement.employeeNumber || !achievement.startDateTime || !achievement.endDateTime || !achievement.subject) {
      return NextResponse.json({ success: false, message: "必須フィールドが不足しています" }, { status: 400 })
    }

    const keyID = await addAchievement(achievement)

    return NextResponse.json({
      success: true,
      message: "実績データが正常に追加されました",
      keyID,
    })
  } catch (error) {
    console.error("実績データの追加中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "実績データの追加中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// 実績データを更新
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { keyID, ...achievement } = data

    if (!keyID) {
      return NextResponse.json({ success: false, message: "keyIDが指定されていません" }, { status: 400 })
    }

    const success = await updateAchievement(keyID, achievement)

    if (!success) {
      return NextResponse.json(
        { success: false, message: "指定されたkeyIDの実績データが見つかりません" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "実績データが正常に更新されました",
    })
  } catch (error) {
    console.error("実績データの更新中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "実績データの更新中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// 実績データを削除
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyID = searchParams.get("keyID")

    if (!keyID) {
      return NextResponse.json({ success: false, message: "keyIDが指定されていません" }, { status: 400 })
    }

    const success = await deleteAchievement(keyID)

    if (!success) {
      return NextResponse.json(
        { success: false, message: "指定されたkeyIDの実績データが見つかりません" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "実績データが正常に削除されました",
    })
  } catch (error) {
    console.error("実績データの削除中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "実績データの削除中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
