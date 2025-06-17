import { NextResponse } from "next/server"
import { getProjects, getProjectsByDepartment } from "@/lib/project/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")

    console.log("API: Request for projects with department:", department)

    let projects
    if (department) {
      projects = await getProjectsByDepartment(department)
    } else {
      projects = await getProjects()
    }

    console.log(`API: Returning ${projects.length} projects`)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
