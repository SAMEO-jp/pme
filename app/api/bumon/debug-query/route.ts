import { NextResponse } from "next/server"
import { getDb } from "@/lib/bumon/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "SELECT * FROM bumon LIMIT 10"

    const db = await getDb()
    const result = await db.all(query)

    return NextResponse.json({
      success: true,
      query,
      result,
    })
  } catch (error) {
    console.error("Query execution failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
