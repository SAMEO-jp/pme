import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

export async function PUT(request: Request, { params }: { params: { ticketId: string } }) {
  try {
    const ticketId = params.ticketId
    const body = await request.json()
    const { title, status, priority, assignee, assignee_id, dueDate } = body
    const db = await getDbConnection()
    try {
      await db.run(
        `UPDATE project_ticket SET title = ?, status = ?, priority = ?, assignee = ?, assignee_id = ?, dueDate = ? WHERE id = ?`,
        [title, status, priority, assignee, assignee_id, dueDate, ticketId]
      )
      return NextResponse.json({ success: true })
    } finally {
      await db.close()
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "チケット更新中にエラーが発生しました", error: String(error) }, { status: 500 })
  }
} 