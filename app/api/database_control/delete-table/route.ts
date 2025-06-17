import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tableName = searchParams.get("tableName")

    if (!tableName) {
      return NextResponse.json({ error: "テーブル名は必須です" }, { status: 400 })
    }

    // データベースファイルが存在するか確認
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: `データベースファイルが見つかりません` }, { status: 404 })
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // テーブルが存在するか確認
    const tableExists = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName])

    if (!tableExists) {
      await db.close()
      return NextResponse.json({ error: `テーブル "${tableName}" が見つかりません` }, { status: 404 })
    }

    // テーブルを削除
    await db.exec(`DROP TABLE IF EXISTS "${tableName}"`)

    // データベースを閉じる
    await db.close()

    return NextResponse.json({
      success: true,
      message: `テーブル "${tableName}" が正常に削除されました。`,
    })
  } catch (error) {
    console.error("テーブル削除エラー:", error)
    return NextResponse.json(
      {
        error: `テーブル削除中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
