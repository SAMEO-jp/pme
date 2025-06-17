import { NextResponse } from "next/server"
import { addUserToProject, getCurrentUserId } from "@/lib/project/db"

export async function POST(request: Request) {
  try {
    const { projectId, role } = await request.json()
    console.log("Join request received:", { projectId, role })

    if (!projectId) {
      console.log("Project ID is missing")
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()
    console.log("Current user ID:", userId)
    if (!userId) {
      console.log("User not authenticated")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Add user to project
    console.log("Attempting to add user to project")
    const result = await addUserToProject(userId.toString(), projectId, role)
    console.log("Add user result:", result)

    if (result.message === "Already a member") {
      console.log("User is already a member")
      return NextResponse.json({ error: "すでに参加済みです" }, { status: 400 })
    }

    if (result.changes === 0) {
      console.log("Failed to join project")
      return NextResponse.json({ error: "Failed to join project" }, { status: 500 })
    }

    console.log("Successfully joined project")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in join route:", error)
    return NextResponse.json({ error: "Failed to join project" }, { status: 500 })
  }
}
