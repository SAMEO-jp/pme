import { type NextRequest, NextResponse } from "next/server"
import { getProjectById, deleteProject } from "@/lib/bumon/actions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectNumber = params.id

    // データベースからプロジェクト情報を取得
    const project = await getProjectById(projectNumber)

    if (!project) {
      return NextResponse.json({ error: "プロジェクトが見つかりません" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error(`Failed to fetch project with ID ${params.id}:`, error)
    return NextResponse.json({ error: "プロジェクト情報の取得に失敗しました" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectNumber = params.id

    // データベースからプロジェクト情報を削除
    await deleteProject(projectNumber)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete project with ID ${params.id}:`, error)
    return NextResponse.json({ error: "プロジェクト情報の削除に失敗しました" }, { status: 500 })
  }
}
