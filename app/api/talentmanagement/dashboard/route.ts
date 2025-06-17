import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { DashboardData } from "@/app/talentmanagement/types"

export async function GET(request: NextRequest) {
  try {
    // TODO: データベースから実際のデータを取得
    const mockData: DashboardData = {
      totalEmployees: 150,
      activeProjects: 12,
      upcomingEvaluations: 25,
      skillGaps: 8,
    }

    return NextResponse.json(
      {
        success: true,
        data: mockData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("ダッシュボードデータの取得に失敗しました:", error)
    return NextResponse.json(
      {
        success: false,
        message: "ダッシュボードデータの取得に失敗しました",
      },
      { status: 500 }
    )
  }
} 