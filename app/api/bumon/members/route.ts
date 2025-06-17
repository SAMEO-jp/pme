import { type NextRequest, NextResponse } from "next/server"
import { getMembersByDepartment } from "@/lib/bumon/actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentCode = searchParams.get("departmentCode")

    if (!departmentCode) {
      return NextResponse.json({ error: "部門コードが指定されていません" }, { status: 400 })
    }

    // データベースからメンバー情報を取得
    const members = await getMembersByDepartment(departmentCode)
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Failed to fetch members:", error)
    return NextResponse.json({ error: "メンバー情報の取得に失敗しました" }, { status: 500 })
  }
}
