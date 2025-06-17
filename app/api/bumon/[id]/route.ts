import { type NextRequest, NextResponse } from "next/server"
import type { Department } from "@/lib/bumon/types"
import { getDepartmentById, updateDepartment, deleteDepartment } from "@/lib/bumon/actions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // データベースから部門情報を取得
    const department = await getDepartmentById(id)

    if (!department) {
      return NextResponse.json({ error: "部門が見つかりません" }, { status: 404 })
    }

    return NextResponse.json({ department })
  } catch (error) {
    console.error(`Failed to fetch department with ID ${params.id}:`, error)
    return NextResponse.json({ error: "部門情報の取得に失敗しました" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const body = await request.json()
    const department: Department = body.department

    // バリデーション
    if (!department.bumon_id || !department.name || !department.startday) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // データベースの部門情報を更新
    await updateDepartment(department)

    return NextResponse.json({ success: true, department })
  } catch (error) {
    console.error(`Failed to update department with ID ${params.id}:`, error)
    return NextResponse.json({ error: "部門情報の更新に失敗しました" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // データベースから部門情報を削除
    await deleteDepartment(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete department with ID ${params.id}:`, error)
    return NextResponse.json({ error: "部門情報の削除に失敗しました" }, { status: 500 })
  }
}
