import { type NextRequest, NextResponse } from "next/server"
import { deleteMemberHistory, updateMemberStatus } from "@/lib/bumon/actions"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 })
    }

    // データベースから部門メンバー履歴を削除
    await deleteMemberHistory(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "部門メンバー履歴の削除に失敗しました" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 })
    }

    const body = await request.json()
    const { role, end_date } = body

    // バリデーション
    if (!role) {
      return NextResponse.json({ error: "役割が指定されていません" }, { status: 400 })
    }

    // メンバーの状態を更新
    await updateMemberStatus(id, role, end_date)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "メンバー状態の更新に失敗しました" }, { status: 500 })
  }
}
