import { type NextRequest, NextResponse } from "next/server"
import type { Department } from "@/lib/bumon/types"
import { getDepartments, createDepartment } from "@/lib/bumon/actions"

export async function GET() {
  try {
    // データベースから部門情報を取得
    const departments = await getDepartments()
    return NextResponse.json({ departments })
  } catch (error) {
    console.error("Failed to fetch departments:", error)
    return NextResponse.json({ error: "部門情報の取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const department: Department = body.department

    // バリデーション
    if (!department.code || !department.name || !department.startDate) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // データベースに部門情報を保存
    const result = await createDepartment(department)

    return NextResponse.json({
      success: true,
      department: { ...department, id: result.id },
    })
  } catch (error) {
    console.error("Failed to create department:", error)
    return NextResponse.json({ error: "部門情報の作成に失敗しました" }, { status: 500 })
  }
}
