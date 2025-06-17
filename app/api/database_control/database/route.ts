import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルを保存するディレクトリ
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    const { tableName, sql } = await request.json()

    if (!tableName || !sql) {
      return NextResponse.json({ error: "テーブル名とSQLは必須です" }, { status: 400 })
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // SQLを実行
    await db.exec(sql)

    // データベースを閉じる
    await db.close()

    return NextResponse.json({
      success: true,
      message: `テーブル "${tableName}" が正常に作成されました。`,
      dbPath: DB_PATH,
    })
  } catch (error) {
    console.error("データベース作成エラー:", error)
    return NextResponse.json(
      { error: `データベース作成中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
