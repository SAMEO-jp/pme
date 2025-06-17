import { NextResponse } from "next/server"
import { getCurrentUserId, getUserById } from "@/lib/project/db"

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "No user currently logged in" }, { status: 404 })
    }

    const user = await getUserById(userId)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Failed to fetch current user" }, { status: 500 })
  }
}
