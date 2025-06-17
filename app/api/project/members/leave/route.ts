import { NextResponse } from "next/server"
import { removeUserFromProject, getCurrentUserId } from "@/lib/project/db"

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Remove user from project
    const result = await removeUserFromProject(userId.toString(), projectId)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Failed to leave project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error leaving project:", error)
    return NextResponse.json({ error: "Failed to leave project" }, { status: 500 })
  }
}
