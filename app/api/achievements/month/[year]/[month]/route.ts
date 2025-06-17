import { NextRequest, NextResponse } from "next/server"
import { open } from "sqlite"
import sqlite3 from "sqlite3"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  try {
    const year = parseInt(params.year)
    const month = parseInt(params.month)
    const searchParams = request.nextUrl.searchParams
    const employeeNumber = searchParams.get("employeeNumber")

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json(
        { success: false, message: "無効な年月です" },
        { status: 400 }
      )
    }

    if (!employeeNumber) {
      return NextResponse.json(
        { success: false, message: "社員番号が必要です" },
        { status: 400 }
      )
    }

    const db = await open({
      filename: path.join(process.cwd(), "data", "achievements.db"),
      driver: sqlite3.Database,
    })

    // デバッグ情報
    console.log("Query parameters:", {
      year: year.toString(),
      month: month.toString().padStart(2, "0"),
      employeeNumber: parseInt(employeeNumber)
    })

    // まず、データが存在するか確認
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM main_Zisseki 
      WHERE employeeNumber = ?
    `
    const countResult = await db.get(countQuery, [parseInt(employeeNumber)])
    console.log("Total records for employee:", countResult)

    // 指定された年月のデータを取得（社員番号でフィルタリング）
    const query = `
      SELECT * FROM main_Zisseki 
      WHERE strftime('%Y', startDateTime) = ? 
      AND strftime('%m', startDateTime) = ? 
      AND employeeNumber = ?
      ORDER BY startDateTime ASC
    `
    console.log("Query:", query)
    
    const achievements = await db.all(query, [
      year.toString(),
      month.toString().padStart(2, "0"),
      parseInt(employeeNumber)
    ])

    console.log("Found records:", achievements.length)

    await db.close()

    return NextResponse.json({ success: true, data: achievements })
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "データの取得に失敗しました" },
      { status: 500 }
    )
  }
}
