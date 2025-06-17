import { NextResponse } from "next/server"
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

export async function GET() {
  try {
    // データベースファイルが存在しない場合は空の配列を返す
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ tables: [] })
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // テーブル一覧を取得
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")

    // データベースを閉じる
    await db.close()

    // テーブル名の配列を返す
    const tableNames = tables.map((table) => table.name)

    return NextResponse.json({ tables: tableNames })
  } catch (error) {
    console.error("テーブル一覧取得エラー:", error)
    return NextResponse.json(
      {
        error: `テーブル一覧の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
