import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

export async function POST(request: NextRequest) {
  try {
    const { tableName, record } = await request.json()

    if (!tableName || !record) {
      return NextResponse.json({ error: "テーブル名とレコードデータは必須です" }, { status: 400 })
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
    const columnNames = tableInfo.map((col) => col.name)

    // INSERTクエリの構築
    const columns = Object.keys(record).filter((key) => columnNames.includes(key))
    if (columns.length === 0) {
      await db.close()
      return NextResponse.json({ error: "挿入するカラムがありません" }, { status: 400 })
    }

    const placeholders = columns.map(() => "?").join(", ")
    const values = columns.map((col) => record[col])

    const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`

    try {
      // クエリの実行
      const result = await db.run(query, values)

      // データベースを閉じる
      await db.close()

      return NextResponse.json({
        success: true,
        message: `レコードが正常に追加されました。`,
        lastInsertId: result.lastID,
      })
    } catch (error) {
      // 主キー重複などのエラーをキャッチ
      await db.close()
      return NextResponse.json(
        {
          error: `レコード追加中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("レコード追加エラー:", error)
    return NextResponse.json(
      {
        error: `レコード追加中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
