import { NextResponse } from "next/server"
import { getUserProjects, addUserProject } from "@/lib/db_utils"
import { getCurrentUserId } from "@/lib/project/db"

// ユーザーのプロジェクト一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let userID = searchParams.get("userID")
    const projectCode = searchParams.get("projectCode")
    const projectType = searchParams.get("projectType") // "project" または "indirect"

    // userIDが指定されていない場合は現在のユーザーIDを使用
    if (!userID) {
      const currentUserId = await getCurrentUserId()
      if (!currentUserId) {
        return NextResponse.json({
          success: false,
          message: "ユーザーIDが指定されていません"
        }, { status: 401 })
      }
      userID = currentUserId.toString()
    }

    console.log(`ユーザープロジェクト取得: userID=${userID}, projectType=${projectType || 'すべて'}`)

    // プロジェクトコードが指定されている場合は特定のプロジェクトのみ取得
    const projects = await getUserProjects(userID, projectCode)

    // プロジェクトデータが存在しない場合はエラーを返す
    if (!projects || projects.length === 0) {
      console.log(`ユーザーID ${userID} のプロジェクトが見つかりませんでした`)
      return NextResponse.json({
        success: false,
        message: `ユーザーID ${userID} のプロジェクトが見つかりませんでした`
      }, { status: 404 })
    }

    console.log(`取得したプロジェクト数: ${projects.length}`)

    // プロジェクトデータをフロントエンド用に整形
    const formattedProjects = projects.map(project => ({
      id: project.id,
      projectNumber: project.projectNumber || project.project_id,
      projectCode: project.projectCode || project.project_id,
      name: project.name || project.projectName,
      clientName: project.clientName,
      status: project.status,
      isProject: project.isProject,
      role: project.role,
      startDate: project.startDate || project.start_date
    }));

    // projectTypeが指定されている場合はフィルタリング
    let filteredProjects = formattedProjects;
    if (projectType) {
      filteredProjects = formattedProjects.filter(project => {
        if (projectType === "project") {
          return project.isProject === 1 || project.isProject === "1";
        } else if (projectType === "indirect") {
          return project.isProject === 0 || project.isProject === "0";
        }
        return true;
      });
    }

    // フィルタリング後にもデータがない場合はエラーを返す
    if (filteredProjects.length === 0) {
      console.log(`フィルタリング後(${projectType})のプロジェクトが0件になりました`)
      return NextResponse.json({
        success: false,
        message: `${projectType === "project" ? "プロジェクト" : "間接業務"}データが読み込めません`
      }, { status: 404 })
    }

    console.log(`フィルタリング後のプロジェクト数: ${filteredProjects.length}`)

    return NextResponse.json({
      success: true,
      data: filteredProjects,
    })
  } catch (error) {
    console.error("ユーザープロジェクトの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "ユーザープロジェクトの取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

// ユーザーをプロジェクトに追加
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userID, projectCode, role } = body

    if (!userID || !projectCode) {
      return NextResponse.json(
        { success: false, message: "ユーザーIDとプロジェクトコードが必要です" },
        { status: 400 },
      )
    }

    const result = await addUserProject(userID, projectCode, role || "メンバー")

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("ユーザーのプロジェクト追加中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "ユーザーのプロジェクト追加中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
