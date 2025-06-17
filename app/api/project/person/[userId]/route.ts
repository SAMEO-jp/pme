import { NextResponse } from "next/server"
import { openDb, getCurrentUserId } from "@/lib/project/db"

interface Params {
  params: {
    userId: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    let userId = params.userId
    let isCurrentUser = false
    let userName = ""
    
    // ユーザーIDが "current" の場合、現在のログインユーザーのIDを使用
    if (userId === "current") {
      const currentUserId = await getCurrentUserId()
      if (!currentUserId) {
        return NextResponse.json(
          { error: "Current user not found" },
          { status: 404 }
        )
      }
      userId = currentUserId
      isCurrentUser = true
    }
    
    const db = await openDb()
    
    // ユーザー名を取得 (bumon_member_historyから)
    try {
      const userInfo = await db.get(
        `SELECT user_id as id, user_id as name FROM bumon_member_history WHERE user_id = ? LIMIT 1`,
        [userId]
      )
      if (userInfo) {
        userName = userInfo.name
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
    
    // project_member_historiesテーブルからユーザーが参加しているプロジェクトを取得
    const projectMembers = await db.all(
      `
      SELECT
        pmh.*,
        p.*,
        pmh.role as member_role,
        pmh.start_date as join_date
      FROM
        project_member_histories pmh
      JOIN
        projects p ON pmh.project_id = p.projectNumber
      WHERE
        pmh.user_id = ?
        AND (pmh.end_date IS NULL OR pmh.end_date > date('now'))
      ORDER BY
        pmh.start_date DESC
      `,
      [userId]
    )
    
    // レスポンス用にプロジェクト情報を整形
    const projects = projectMembers.map(pm => ({
      id: pm.id,
      projectNumber: pm.projectNumber,
      name: pm.name,
      description: pm.description,
      status: pm.status,
      clientName: pm.clientName,
      startDate: pm.startDate,
      endDate: pm.endDate,
      role: pm.member_role,
      joinDate: pm.join_date
    }))
    
    return NextResponse.json({
      userId,
      userName,
      isCurrentUser,
      projects
    })
  } catch (error) {
    console.error("Error fetching user projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch user projects" },
      { status: 500 }
    )
  }
} 