import { NextResponse } from "next/server"
import { openDb } from "@/lib/project/db"

export async function POST(request: Request) {
  try {
    const { projectId, memberId, role, joinDate } = await request.json()
    console.log("Add member request received:", { projectId, memberId, role, joinDate })

    if (!projectId || !memberId || !role || !joinDate) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, memberId, role, joinDate" },
        { status: 400 }
      )
    }

    const db = await openDb()
    
    // 既にメンバーかどうか確認
    const existingMember = await db.get(
      `
      SELECT * FROM project_member_histories 
      WHERE project_id = ? AND member_id = ? 
      AND (left_at IS NULL OR left_at > date('now'))
      `,
      [projectId, memberId]
    )

    if (existingMember) {
      return NextResponse.json(
        { error: "Member already in project", member: existingMember },
        { status: 400 }
      )
    }
    
    // project_member_historiesテーブルにメンバーを追加
    const result = await db.run(
      `
      INSERT INTO project_member_histories 
      (project_id, member_id, joined_at, role) 
      VALUES (?, ?, ?, ?)
      `,
      [projectId, memberId, joinDate, role]
    )
    
    return NextResponse.json({ 
      success: true, 
      projectId, 
      memberId, 
      role,
      result
    })
  } catch (error) {
    console.error("Error adding member to project:", error)
    return NextResponse.json(
      { error: "Failed to add member to project" }, 
      { status: 500 }
    )
  }
} 