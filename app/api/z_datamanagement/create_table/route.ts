import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"

interface Column {
  name: string
  type: string
  isKey: boolean
}

export async function POST(request: Request) {
  try {
    const { tableName, columns } = await request.json()

    if (!tableName || typeof tableName !== "string") {
      return NextResponse.json(
        { error: "テーブル名が無効です" },
        { status: 400 }
      )
    }

    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json(
        { error: "カラム定義が無効です" },
        { status: 400 }
      )
    }

    // テーブル名のバリデーション
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return NextResponse.json(
        { error: "テーブル名は英数字とアンダースコアのみ使用可能です" },
        { status: 400 }
      )
    }

    // データベース接続を取得
    const db = await getDbConnection()

    // テーブルが既に存在するか確認
    const existingTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    )

    if (existingTable) {
      return NextResponse.json(
        { error: "このテーブル名は既に使用されています" },
        { status: 400 }
      )
    }

    // カラム定義を作成
    const columnDefinitions = columns.map((col: Column) => {
      const definition = `${col.name} ${col.type}`
      return col.isKey ? `${definition} PRIMARY KEY` : definition
    })

    // テーブル作成SQLを実行
    const createTableSQL = `
      CREATE TABLE ${tableName} (
        ${columnDefinitions.join(', ')}
      )
    `

    await db.run(createTableSQL)

    return NextResponse.json({ message: "テーブルが正常に作成されました" })
  } catch (error) {
    console.error("テーブル作成エラー:", error)
    return NextResponse.json(
      { error: "テーブルの作成に失敗しました" },
      { status: 500 }
    )
  }
} 