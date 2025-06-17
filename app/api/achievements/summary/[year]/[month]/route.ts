import { NextResponse } from "next/server"
import { getProjectSummaryByMonth } from "@/lib/db_utils"

export async function GET(
  request: Request,
  { params }: { params: { year: string; month: string } }
) {
  try {
    const paramsData = await Promise.resolve(params);
    const year = Number.parseInt(paramsData.year)
    const month = Number.parseInt(paramsData.month)

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ success: false, message: "無効な年または月が指定されました" }, { status: 400 })
    }

    const summaryData = await getProjectSummaryByMonth(year, month)

    return NextResponse.json({
      success: true,
      data: summaryData,
    })
  } catch (error) {
    console.error("集計データの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "集計データの取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
} 