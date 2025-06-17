import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "プロジェクトIDが指定されていません" },
        { status: 400 }
      )
    }

    const db = await getDbConnection()
    try {
      const equipments = await db.all(
        "SELECT * FROM project_equipment WHERE project_id = ? ORDER BY equipment_id",
        [projectId]
      )

      return NextResponse.json({
        success: true,
        data: equipments,
      })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("設備情報の取得中にエラーが発生しました:", error)
    return NextResponse.json(
      {
        success: false,
        message: "設備情報の取得中にエラーが発生しました",
        error: String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { project_id, equipment_id, equipment_Name, equipment_Description, id_kind } = body
    if (!project_id || !equipment_id || !equipment_Name) {
      return NextResponse.json({ success: false, message: "必須項目が不足しています" }, { status: 400 })
    }
    const db = await getDbConnection()
    try {
      await db.run(
        `INSERT INTO project_equipment (project_id, equipment_id, equipment_Name, equipment_Description, id_kind)
         VALUES (?, ?, ?, ?, ?)`,
        [project_id, equipment_id, equipment_Name, equipment_Description || "", id_kind || ""]
      )
      return NextResponse.json({ success: true })
    } catch (e) {
      if (String(e).includes("UNIQUE constraint failed")) {
        return NextResponse.json({ success: false, message: "同じ設備番号が既に登録されています" }, { status: 409 })
      }
      throw e
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("設備情報追加中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "設備情報追加中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { project_id, equipment_id, equipment_Name, equipment_Description, id_kind } = body
    if (!project_id || !equipment_id || !equipment_Name) {
      return NextResponse.json({ success: false, message: "必須項目が不足しています" }, { status: 400 })
    }
    const db = await getDbConnection()
    try {
      await db.run(
        `UPDATE project_equipment SET equipment_Name = ?, equipment_Description = ?, id_kind = ? WHERE project_id = ? AND equipment_id = ?`,
        [equipment_Name, equipment_Description || "", id_kind || "", project_id, equipment_id]
      )
      return NextResponse.json({ success: true })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("設備情報編集中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "設備情報編集中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { project_id, equipment_id } = body
    if (!project_id || !equipment_id) {
      return NextResponse.json({ success: false, message: "必須項目が不足しています" }, { status: 400 })
    }
    const db = await getDbConnection()
    try {
      await db.run(
        `DELETE FROM project_equipment WHERE project_id = ? AND equipment_id = ?`,
        [project_id, equipment_id]
      )
      return NextResponse.json({ success: true })
    } finally {
      await db.close()
    }
  } catch (error) {
    console.error("設備情報削除中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "設備情報削除中にエラーが発生しました", error: String(error) },
      { status: 500 }
    )
  }
} 