import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    console.log("API: リクエスト受信 - ユーザーID:", userId)

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ユーザーIDが指定されていません" },
        { status: 400 }
      )
    }

    // プロジェクトメンバー履歴から参加中のプロジェクトを取得
    const projects = await db.all(`
      SELECT 
        pmh.*,
        p.projectNumber,
        p.name as projectName,
        p.clientName,
        p.classification,
        p.status,
        p.isProject,
        p.projectNumber as projectCode,
        pmh.role,
        pmh.start_date as startDate,
        pmh.end_date as endDate
      FROM project_member_histories pmh
      INNER JOIN projects p ON pmh.project_id = p.projectNumber
      WHERE pmh.user_id = ?
      AND (pmh.end_date IS NULL OR pmh.end_date = '')
      ORDER BY p.projectNumber ASC
    `, [userId])

    console.log("API: 取得したプロジェクト数:", projects?.length || 0)
    if (projects && projects.length > 0) {
      console.log("API: 最初のプロジェクトのend_date:", projects[0].endDate)
      console.log("API: 最初のプロジェクトのend_dateの型:", typeof projects[0].endDate)
    }

    if (!projects || projects.length === 0) {
      console.log("API: プロジェクトが見つかりません")
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // プロジェクトデータをフロントエンド用に整形
    const formattedProjects = projects.map(project => ({
      id: project.id,
      projectNumber: project.projectNumber,
      projectCode: project.projectCode,
      name: project.projectName,
      clientName: project.clientName,
      status: project.status,
      isProject: project.isProject === '1' ? 1 : 0,
      role: project.role,
      startDate: project.startDate
    }))

    console.log("API: 整形後のプロジェクト:", formattedProjects[0])

    return NextResponse.json({
      success: true,
      data: formattedProjects
    })
  } catch (error) {
    console.error("API: プロジェクト取得エラー:", error)
    return NextResponse.json(
      { success: false, message: "プロジェクトの取得に失敗しました" },
      { status: 500 }
    )
  }
}
