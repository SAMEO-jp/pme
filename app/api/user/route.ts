import { NextResponse } from "next/server"
import { db } from '@/lib/db'
import { getUser, getCurrentUserId } from "@/lib/db_utils"

// 現在のユーザー情報を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let userID = searchParams.get("userID")

    // userIDが指定されていない場合は現在のユーザーIDを使用
    if (!userID) {
      const currentUserId = await getCurrentUserId()
      if (!currentUserId) {
        return NextResponse.json({
          success: false,
          message: "ユーザーIDが指定されていません"
        }, { status: 401 })
      }
      userID = currentUserId.toString()
    }

    const user = await getUser(userID)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "ユーザーが見つかりません"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "ユーザー情報の取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// ユーザーIDを設定
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが指定されていません' },
        { status: 400 }
      )
    }

    // ユーザーIDが存在するか確認
    const user = await db.get(`
      SELECT user_id, name_japanese
      FROM all_user
      WHERE user_id = ?
    `, [userId])

    if (!user) {
      return NextResponse.json(
        { error: '指定されたユーザーIDは存在しません' },
        { status: 404 }
      )
    }

    // 現在のユーザーIDを設定
    await db.run(
      'INSERT OR REPLACE INTO app_settings (key, value, description) VALUES (?, ?, ?)',
      ['Now_userID', userId, '現在ログイン中のユーザーID']
    )

    return NextResponse.json({
      success: true,
      message: 'ユーザーIDが正常に設定されました',
      data: {
        user_id: user.user_id,
        name: user.name_japanese
      }
    })
  } catch (error) {
    console.error('ユーザーIDの設定中にエラーが発生しました:', error)
    return NextResponse.json(
      { error: 'ユーザーIDの設定に失敗しました' },
      { status: 500 }
    )
  }
}
