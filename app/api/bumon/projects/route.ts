import { type NextRequest, NextResponse } from "next/server"
import { getProjectsByDepartment } from "@/lib/bumon/actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentCode = searchParams.get("departmentCode")

    if (!departmentCode) {
      return NextResponse.json({ error: "部門コードが指定されていません" }, { status: 400 })
    }

    console.log(`API: Fetching projects for department ${departmentCode}`)

    // データベースからプロジェクト情報を取得
    const projects = await getProjectsByDepartment(departmentCode)

    console.log(`API: Found ${projects.length} projects for department ${departmentCode}`)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "プロジェクト情報の取得に失敗しました" }, { status: 500 })
  }
}
