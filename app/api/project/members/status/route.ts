import { NextResponse } from "next/server"
import { isUserProjectMember, getCurrentUserId } from "@/lib/project/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const isMember = await isUserProjectMember(userId, projectId)

    return NextResponse.json({ isMember })
  } catch (error) {
    console.error("Error checking member status:", error)
    return NextResponse.json({ error: "Failed to check member status" }, { status: 500 })
  }
}
