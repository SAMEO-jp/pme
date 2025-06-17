import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

// CSVデータを生成する関数
function generateCSV(data: any[], headers: string[]): string {
  // ヘッダー行
  let csv = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n"

  // データ行
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      if (value === null || value === undefined) return ""
      if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`
      return value
    })
    csv += values.join(",") + "\r\n"
  }

  return csv
}

export async function GET(request: NextRequest) {
  try {
    // データベースファイルが存在するか確認
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: `データベースファイルが見つかりません` }, { status: 404 })
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // テーブル一覧を取得
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")

    if (tables.length === 0) {
      await db.close()
      return NextResponse.json({ error: "データベースにテーブルがありません" }, { status: 404 })
    }

    // 各テーブルのデータを取得してCSVに変換
    const csvFiles: { name: string; content: string }[] = []

    for (const table of tables) {
      const tableName = table.name

      // テーブル情報を取得
      const tableInfo = await db.all(`PRAGMA table_info(${tableName})`)

      // テーブルのデータを取得
      const rows = await db.all(`SELECT * FROM ${tableName}`)

      // ヘッダー行を取得
      const headers = tableInfo.map((column) => column.name)

      // CSVデータを生成
      const csvContent = generateCSV(rows, headers)

      csvFiles.push({
        name: tableName,
        content: csvContent,
      })
    }

    // データベースを閉じる
    await db.close()

    // ZIPファイルを生成するためのJSONデータを返す
    return NextResponse.json({
      success: true,
      tables: csvFiles.map((file) => ({
        name: file.name,
        content: file.content,
      })),
    })
  } catch (error) {
    console.error("データベースエクスポートエラー:", error)
    return NextResponse.json(
      {
        error: `データベースエクスポート中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
