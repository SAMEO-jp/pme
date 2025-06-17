import { type NextRequest, NextResponse } from "next/server"
import { getMemberHistory, addMemberHistory, getMembersByDepartment } from "@/lib/bumon/actions"
import type { MemberHistory } from "@/lib/bumon/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentCode = searchParams.get("departmentCode")

    if (departmentCode) {
      // 特定の部門のメンバーを取得
      const members = await getMembersByDepartment(departmentCode)
      return NextResponse.json({ members })
    } else {
      // 全ての部門メンバー履歴を取得
      const members = await getMemberHistory()
      return NextResponse.json({ members })
    }
  } catch (error) {
    return NextResponse.json({ error: "部門メンバー履歴の取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const memberItem: Omit<MemberHistory, "id"> = body.member

    // バリデーション
    if (!memberItem.bumon_id || !memberItem.user_id || !memberItem.start_date) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // データベースに保存
    const result = await addMemberHistory(memberItem)

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    return NextResponse.json({ error: "部門メンバー履歴の作成に失敗しました" }, { status: 500 })
  }
}
