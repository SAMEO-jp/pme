import { type NextRequest, NextResponse } from "next/server"
import { getProjectMemberHistory } from "@/lib/bumon/actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "プロジェクトIDが指定されていません" }, { status: 400 })
    }

    // データベースからプロジェクトメンバー履歴を取得
    const members = await getProjectMemberHistory(projectId)
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Failed to fetch project members:", error)
    return NextResponse.json({ error: "プロジェクトメンバー情報の取得に失敗しました" }, { status: 500 })
  }
}
