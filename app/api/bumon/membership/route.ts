import { type NextRequest, NextResponse } from "next/server"
import { joinDepartment, leaveDepartment, checkUserMembership, getDepartmentMembers } from "@/lib/bumon/actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentCode = searchParams.get("departmentCode") // この値はbumon_idカラムとして使用されます
    const userId = searchParams.get("userId")

    if (!departmentCode) {
      return NextResponse.json({ error: "部門コード(bumon_id)が指定されていません" }, { status: 400 })
    }

    if (userId) {
      // 特定のユーザーの参加状況を確認
      const isMember = await checkUserMembership(userId, departmentCode)
      return NextResponse.json({ isMember })
    } else {
      // 部門のメンバー一覧を取得
      const members = await getDepartmentMembers(departmentCode)
      return NextResponse.json({ members })
    }
  } catch (error) {
    return NextResponse.json({ error: "メンバーシップ情報の取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, departmentCode, position, action } = body // departmentCodeはbumon_idとして使用されます

    if (!userId || !departmentCode || !action) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 })
    }

    if (action === "join") {
      // 部門に参加 (departmentCodeはbumon_idとして使用)
      await joinDepartment(userId, departmentCode, position || "社員")
      return NextResponse.json({ success: true, message: "部門に参加しました" })
    } else if (action === "leave") {
      // 部門から退出
      await leaveDepartment(userId, departmentCode)
      return NextResponse.json({ success: true, message: "部門から退出しました" })
    } else {
      return NextResponse.json({ error: "無効なアクションです" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "bumon_member_historyテーブルにpositionカラムがありません。データベーススキーマとコードの不一致があります。",
      },
      { status: 500 },
    )
  }
}
