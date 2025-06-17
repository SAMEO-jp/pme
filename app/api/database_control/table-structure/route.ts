import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export async function GET(request: NextRequest) {
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

    // テーブル情報を取得
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`)

    // データベースを閉じる
    await db.close()

    return NextResponse.json({
      success: true,
      structure: tableInfo,
    })
  } catch (error) {
    console.error("テーブル構造取得エラー:", error)
    return NextResponse.json(
      {
        error: `テーブル構造の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
