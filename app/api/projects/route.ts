import { NextResponse } from "next/server"
import { getProjects } from "@/lib/db_utils"

export async function GET() {
  try {
    const projects = await getProjects()

    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("プロジェクトデータの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "プロジェクトデータの取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
