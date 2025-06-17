import { NextResponse } from "next/server"
import { getProjectByNumber } from "@/lib/project/db"

export async function GET(request: Request, { params }: { params: { projectNumber: string } }) {
  try {
    const project = await getProjectByNumber(params.projectNumber)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
