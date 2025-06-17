import { type NextRequest, NextResponse } from "next/server"
import { getDepartmentHistory, deleteDepartmentHistory } from "@/lib/bumon/actions"

export async function GET() {
  try {
    // データベースから部門履歴を取得
    const history = await getDepartmentHistory()
    return NextResponse.json({ history })
  } catch (error) {
    return NextResponse.json({ error: "部門履歴の取得に失敗しました" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 })
    }

    // データベースから部門履歴を削除
    await deleteDepartmentHistory(Number.parseInt(id))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "部門履歴の削除に失敗しました" }, { status: 500 })
  }
}
