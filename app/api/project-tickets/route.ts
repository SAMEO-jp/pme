import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    if (!projectId) {
      return NextResponse.json({ success: false, message: "projectIdは必須です" }, { status: 400 })
    }
    const db = await getDbConnection()
    try {
      const tickets = await db.all(
        "SELECT * FROM project_ticket WHERE project_id = ? ORDER BY createdAt DESC",
        [projectId]
      )
      return NextResponse.json({ success: true, data: tickets })
    } finally {
      await db.close()
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "チケット取得中にエラーが発生しました", error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, project_id, title, status, priority, assignee, assignee_id, createdAt, dueDate } = body
    if (!id || !project_id || !title || !status || !priority || !assignee || !assignee_id || !createdAt || !dueDate) {
      return NextResponse.json({ success: false, message: "必須項目が不足しています" }, { status: 400 })
    }
    const db = await getDbConnection()
    try {
      await db.run(
        `INSERT INTO project_ticket (id, project_id, title, status, priority, assignee, assignee_id, createdAt, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, project_id, title, status, priority, assignee, assignee_id, createdAt, dueDate]
      )
      return NextResponse.json({ success: true })
    } finally {
      await db.close()
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "チケット作成中にエラーが発生しました", error: String(error) }, { status: 500 })
  }
} 